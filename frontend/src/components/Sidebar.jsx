
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { Users, UserPlus, Search, X } from "lucide-react";
import Lottie from "lottie-react";
import ProfileIcon from "../animations/ProfileIcon.json";

const Sidebar = () => {
	const {
		getUsers,
		users,
		selectedUser,
		setSelectedUser,
		isUsersLoading,
		startConversationWithUser,
		unreadMessages,
	} = useChatStore();

	const { onlineUsers = [] } = useAuthStore();
	const [showOnlineOnly, setShowOnlineOnly] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [searchEmail, setSearchEmail] = useState("");

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const filteredUsers = showOnlineOnly
		? users.filter((user) => onlineUsers.includes(user._id))
		: users;

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (searchEmail.trim()) {
			startConversationWithUser(searchEmail.trim());
			setSearchEmail("");
			setIsSearching(false);
		}
	};

	if (isUsersLoading) return <SidebarSkeleton />;

	return (
		<aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
			<div className='border-b border-base-300 w-full p-4'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center gap-2'>
						<Users className='size-6' />
						<span className='font-medium hidden lg:block'>Contacts</span>
					</div>
					<button
						onClick={() => setIsSearching(!isSearching)}
						className='btn btn-ghost btn-circle btn-sm'
					>
						{isSearching ? <X className='size-5' /> : <UserPlus className='size-5' />}
					</button>
				</div>

				{isSearching ? (
					<form
						onSubmit={handleSearchSubmit}
						className='mt-3 hidden lg:flex items-center gap-2'
					>
						<input
							type='email'
							className='input input-bordered input-sm w-full'
							placeholder='Enter user email...'
							value={searchEmail}
							onChange={(e) => setSearchEmail(e.target.value)}
						/>
						<button type='submit' className='btn btn-sm btn-circle btn-primary'>
							<Search className='size-4' />
						</button>
					</form>
				) : (
					<div className='mt-3 hidden lg:flex items-center gap-2'>
						<label className='cursor-pointer flex items-center gap-2'>
							<input
								type='checkbox'
								checked={showOnlineOnly}
								onChange={(e) => setShowOnlineOnly(e.target.checked)}
								className='checkbox checkbox-sm'
							/>
							<span className='text-sm'>Show online only</span>
						</label>
						<span className='text-xs text-base-content/60'>
							({Math.max(0, onlineUsers.length - 1)} online)
						</span>
					</div>
				)}
			</div>

			<div className='overflow-y-auto w-full py-3'>
				{filteredUsers.map((user) => {
                    const unreadCount = unreadMessages[user._id] || 0;
                    const isOnline = onlineUsers.includes(user._id);

                    // --- THIS IS THE NEW LOGIC ---
                    // Determine what to show as the subtitle
                    let subtitle = isOnline ? "Online" : "Offline";
                    if (user.lastMessage) {
                        if (user.lastMessage.text) {
                            subtitle = user.lastMessage.text;
                        } else if (user.lastMessage.images?.length > 0) {
                            subtitle = "Image";
                        }
                    }
                    // -----------------------------

					return (
						<button
							key={user._id}
							onClick={() => setSelectedUser(user)}
							className={`
                                w-full p-3 flex items-center gap-3
                                hover:bg-base-200 transition-colors
                                ${selectedUser?._id === user._id ? "bg-base-300" : ""}
                            `}
						>
							{/* FIX: A single container now wraps both the image and the Lottie animation for consistent alignment */}
							<div className="relative mx-auto lg:mx-0 size-12 flex-shrink-0">
								{user.profilePic ? (
									<img
										src={user.profilePic}
										alt={user.fullName}
										className="w-full h-full object-cover rounded-full"
									/>
								) : (
									<div className="w-full h-full rounded-full bg-base-300 flex items-center justify-center">
										<Lottie
											animationData={ProfileIcon}
											loop={true}
											style={{ height: "40px", width: "40px" }}
										/>
									</div>
								)}
                                {isOnline && (
                                    <span
                                        className="absolute bottom-0 right-0 size-3 bg-success 
                                        rounded-full ring-2 ring-base-100"
                                    />
                                )}
							</div>

							<div className="hidden lg:flex justify-between items-center w-full min-w-0">
								<div className="text-left min-w-0">
									<div className="font-medium truncate">{user.fullName}</div>
                                    {/* Display the subtitle here */}
									<div className="text-sm text-base-content/70 truncate">
										{subtitle}
									</div>
								</div>

                                {unreadCount > 0 && (
                                    <div className='badge badge-primary badge-sm font-semibold'>{unreadCount}</div>
                                )}
							</div>
						</button>
					);
				})}

				{filteredUsers.length === 0 && !isUsersLoading && (
					<div className="text-center text-base-content/60 py-4">
						No users to display
					</div>
				)}
			</div>
		</aside>
	);
};
export default Sidebar;
