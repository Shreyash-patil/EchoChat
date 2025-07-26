import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// const reorderUsers = (userId, state) => {
//   const userToMove = state.users.find((user) => user._id === userId);
//   if (!userToMove) return state.users; // User not in the list, do nothing
//   const otherUsers = state.users.filter((user) => user._id !== userId);
//   return [userToMove, ...otherUsers];
// };

// This helper now handles both reordering and adding new users
// const updateUserList = (user, state) => {
//   const userExists = state.users.some((u) => u._id === user._id);
//   if (userExists) {
//     // If user is already in the list, move them to the top
//     const otherUsers = state.users.filter((u) => u._id !== user._id);
//     return [user, ...otherUsers];
//   } else {
//     // If it's a new conversation, add the user to the top
//     return [user, ...state.users];
//   }
// };

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

  // This is the new, improved subscription logic with notifications
  // initSocketListeners: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.off("newMessage");

  //   socket.on("newMessage", (newMessage) => {
  //     const { selectedUser, users } = get();

  //     // Identify the conversation partner
	// 		const partnerId =
	// 			newMessage.senderId === authUser._id
	// 				? newMessage.receiverId
	// 				: newMessage.senderId;

	// 		const partnerInList = users.find((u) => u._id === partnerId);

	// 		if (partnerInList) {
	// 			// Create an updated user object with the new last message
	// 			const updatedPartner = {
	// 				...partnerInList,
	// 				lastMessage: {
	// 					text: newMessage.text,
	// 					images: newMessage.images,
	// 					createdAt: newMessage.createdAt,
	// 				},
	// 			};
	// 			// Update the user list with the updated user object
	// 			set((state) => ({
	// 				users: updateUserList(updatedPartner, state),
	// 			}));
	// 		}



  //     if (selectedUser && newMessage.senderId === selectedUser._id) {
  //       set((state) => ({
  //         messages: [...state.messages, newMessage],
  //       }));
  //     } else {
  //       set((state) => ({
  //         unreadMessages: {
  //           ...state.unreadMessages,
  //           [newMessage.senderId]:
  //             (state.unreadMessages[newMessage.senderId] || 0) + 1,
  //         },
  //       }));
  //       // --- THIS IS THE NEW NATIVE NOTIFICATION LOGIC ---

  //       // Only show a notification if the user has granted permission AND is not looking at the tab
  //       if (Notification.permission === "granted" && document.hidden) {
  //         // notificationSound.play().catch(error => {
  //         // 	console.log("Error playing notification sound:", error);
  //         // });
  //         console.log("SUCCESS: Both conditions met. Creating notification.");
  //         const sender = users.find((user) => user._id === newMessage.senderId);
  //         const senderName = sender ? sender.fullName : "New Message";

  //         // Create the native browser notification
  //         new Notification(senderName, {
  //           body: newMessage.text || "Sent an image",
  //           // icon: sender?.profilePic || "/default-avatar.png", // Optional: show user's avatar
  //         });
  //       } else {
  //         console.log(
  //           "FAILED: One or both conditions were false. No notification created."
  //         );
  //       }
  //     }
  //     _reorderUsers(get, set, newMessage.senderId);
  //   });
  // },

  // 	initSocketListeners: () => {
	// 	const socket = useAuthStore.getState().socket;
	// 	if (!socket) return;

	// 	socket.off("newMessage");

	// 	socket.on("newMessage", (newMessage) => {
	// 		const { selectedUser, users } = get();
	// 		const authUser = useAuthStore.getState().authUser;

	// 		const partnerId =
	// 			newMessage.senderId === authUser._id
	// 				? newMessage.receiverId
	// 				: newMessage.senderId;

	// 		const partnerInList = users.find((u) => u._id === partnerId);

	// 		if (partnerInList) {
	// 			const updatedPartner = {
	// 				...partnerInList,
	// 				lastMessage: {
	// 					text: newMessage.text,
	// 					images: newMessage.images,
	// 					createdAt: newMessage.createdAt,
	// 				},
	// 			};
				
	// 			set((state) => {
	// 				const newState = {
	// 					users: updateUserList(updatedPartner, state),
	// 				};

	// 				if (selectedUser && partnerId === selectedUser._id) {
	// 					newState.messages = [...state.messages, newMessage];
	// 				} else {
	// 					newState.unreadMessages = {
	// 						...state.unreadMessages,
	// 						[newMessage.senderId]: (state.unreadMessages[newMessage.senderId] || 0) + 1,
	// 					};
	// 					if (Notification.permission === "granted" && document.hidden) {
	// 						notificationSound.play().catch(console.error);
	// 						new Notification(updatedPartner.fullName || "New Message", {
	// 							body: newMessage.text || "Sent an image",
	// 							icon: updatedPartner.profilePic,
	// 						});
	// 					}
	// 				}
	// 				return newState;
	// 			});
	// 		}
	// 	});
	// },

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

  // startConversationWithUser: async (email) => {
  //   set({ isUsersLoading: true });
  //   try {
  //     const res = await axiosInstance.get(`/users/find/${email}`);
  //     const foundUser = res.data;
  //     const { users } = get();

  //     // Check if you're already chatting with this user
  //     const userExists = users.some((user) => user._id === foundUser._id);

  //     // If they're not in your sidebar, add them
  //     if (!userExists) {
  //       set({ users: [...users, foundUser] });
  //       // 2. If user is already in the list, move them to the top
  //       const updatedUsers = [
  //         foundUser,
  //         ...state.users.filter((user) => user._id !== foundUser._id),
  //       ];
  //       return { users: updatedUsers, selectedUser: foundUser };
  //     } else {
  //       // 3. If it's a new conversation, add the user to the top
  //       return { users: [foundUser, ...state.users], selectedUser: foundUser };
  //     }
  //     // Automatically select them to start the chat
  //     set({ selectedUser: foundUser });
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message || "User not found or an error occurred."
  //     );
  //   } finally {
  //     set({ isUsersLoading: false });
  //   }
  // },
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
