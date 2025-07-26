import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";



// This helper now handles both reordering existing users and adding new ones to the top of the list.
const updateUserList = (user, state) => {
	if (!user) return state.users;
	const otherUsers = state.users.filter((u) => u._id !== user._id);
	return [user, ...otherUsers];
};

const notificationSound = new Audio("/notification.wav");

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  unreadMessages: {}, // 1. New state to store unread counts { userId: count }
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessagesSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load users";
      toast.error(errorMessage, { id: "getUsers-error" });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load messages";
      toast.error(errorMessage, { id: "getMessages-error" });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    set({ isMessagesSending: true });
    const { selectedUser } = get();
    if (!selectedUser) return;
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      const newMessage = res.data; // The new message from the server response

      // Create an updated user object with the new last message details
      const updatedSelectedUser = {
        ...selectedUser,
        lastMessage: {
          text: newMessage.text,
          images: newMessage.images,
          createdAt: newMessage.createdAt,
        },
      };
      set((state) => ({
        messages: [...state.messages, res.data],
        // users: updateUserList(selectedUser, state),
        				// Update the user list with the updated user object
				users: updateUserList(updatedSelectedUser, state),
      }));
      // 1. Reorder the list after sending a message
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isMessagesSending: false });
    }
  },

  // setSelectedUser: (user) => set({ selectedUser: user }),

  setSelectedUser: (user) => {
    set((state) => ({
      selectedUser: user,
      unreadMessages: {
        ...state.unreadMessages,
        [user._id]: 0, // Reset count for the selected user
      },
    }));
  },

  

  //latest
  initSocketListeners: () => {
		const socket = useAuthStore.getState().socket;
		if (!socket) return;

		socket.off("newMessage");

		socket.on("newMessage", (newMessage) => {
			const { selectedUser, users, getUsers } = get();
			const authUser = useAuthStore.getState().authUser;

			if (!authUser) return;

			const partnerId =
				String(newMessage.senderId) === String(authUser._id)
					? String(newMessage.receiverId)
					: String(newMessage.senderId);

			const partnerInList = users.find((u) => String(u._id) === partnerId);

			if (partnerInList) {
				// If the user is already in the sidebar, update their last message and reorder
				const updatedPartner = {
					...partnerInList,
					lastMessage: {
						text: newMessage.text,
						images: newMessage.images,
						createdAt: newMessage.createdAt,
					},
				};
				
				set((state) => {
					const newState = {
						users: updateUserList(updatedPartner, state),
					};

					if (selectedUser && String(partnerId) === String(selectedUser._id)) {
						newState.messages = [...state.messages, newMessage];
					} else {
						newState.unreadMessages = {
							...state.unreadMessages,
							[newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
						};
						if (Notification.permission === "granted" && document.hidden) {
							notificationSound.play().catch(console.error);
							new Notification(updatedPartner.fullName || "New Message", {
								body: newMessage.text || "Sent an image",
								icon: updatedPartner.profilePic,
							});
						}
					}
					return newState;
				});
			} 
      else {
				// If this is a new conversation, re-fetch the user list to include the new person
				getUsers();
			}
		});
	},

  cleanupSocketListeners: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    //TODO: optimize this later
    socket.on("newMessage", (newMessage) => {
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  
  startConversationWithUser: async (email) => {
    try {
      const res = await axiosInstance.get(`/users/find/${email}`);
      const foundUser = res.data;

      // Use the updater function form of set to get the latest state
      set((state) => ({
        users: updateUserList(foundUser, state),
        selectedUser: foundUser,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "User not found.");
    }
  },
}));

/**
 * This is the key to the fix. We subscribe the chat store to the auth store.
 * When the socket becomes available or is removed, we automatically manage
 * the message listeners.
 */
useAuthStore.subscribe(
    (state) => state.socket, // Listen to changes in the 'socket' property
    (socket) => {
        if (socket) {
            // When a new socket is available, set up the listeners
            useChatStore.getState().initSocketListeners();
        } else {
            // When the socket is removed (on logout), clean up
            useChatStore.getState().cleanupSocketListeners();
        }
    }
);
