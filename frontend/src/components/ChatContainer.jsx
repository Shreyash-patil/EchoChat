

import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    unsubscribeFromMessages,
    subscribeToMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
  	// if (selectedUser) {
  		getMessages(selectedUser._id);
  	// }
  	subscribeToMessages()

  	return ()=>{unsubscribeFromMessages()}
  }, [selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

  // In ChatContainer.jsx

  useEffect(() => {
    // This is the only logic you need.
    // It fetches messages when the user changes.
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    // The real-time subscription is now handled automatically in your store.
    // You do not need to call subscribe/unsubscribe here anymore.
  }, [selectedUser]); // The effect now only depends on the selected user.

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    // FIX: Added w-full to ensure the container takes up the full available width
    <div className="flex-1 flex flex-col w-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border border-base-300">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div
              className={`
								flex flex-col max-w-[70%] sm:max-w-[50%] rounded-xl p-3 shadow-sm
								${
                  message.senderId === authUser._id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200"
                }
							`}
            >
              {/* FIX: Replaced flex-wrap with a responsive grid for images */}
              {message.images && message.images.length > 0 && (
                <div
                  className={`grid gap-2 mb-2 ${
                    message.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {message.images.map((imgSrc, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={imgSrc}
                      alt="Attachment"
                      // FIX: Added classes for consistent image sizing and aspect ratio
                      className="w-full h-full object-cover rounded-md aspect-square"
                    />
                  ))}
                </div>
              )}
              {message.text && <p className="break-words">{message.text}</p>}
              <div
                className={`text-xs opacity-70 mt-1.5 self-end ${
                  message.senderId === authUser._id
                    ? "text-primary-content/70"
                    : "text-base-content/70"
                }`}
              >
                {formatMessageTime(message.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
