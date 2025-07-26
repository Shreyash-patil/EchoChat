import React from "react";
import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Send, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * A dedicated component for rendering a single theme selection button.
 * @param {object} props
 * @param {string} props.theme - The theme name for this item.
 * @param {string} props.currentTheme - The currently active theme.
 * @param {function(string): void} props.onThemeSelect - The function to call when this item is clicked.
 */
const ThemeItem = ({ theme, currentTheme, onThemeSelect }) => (
	<button
		className={`
      group relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
      ${currentTheme === theme ? "bg-base-200" : "hover:bg-base-200/50"}
    `}
		// Correctly calls the function passed down via props
		onClick={() => onThemeSelect(theme)}
	>
		{/* Exclusive Tag for the Glassmorphism theme */}
		{theme === "glassmorphism" && (
			<div className='absolute top-0 right-0 text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg z-10 font-bold'>
				EXCLUSIVE
			</div>
		)}

		<div className='relative h-8 w-full rounded-md overflow-hidden border border-base-content/20' data-theme={theme}>
			{/* Special preview for Glassmorphism */}
			{theme === "glassmorphism" ? (
				<div className='absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center'>
					<span className='text-white/50 text-[10px]'>Glass</span>
				</div>
			) : (
				<div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
					<div className='rounded bg-primary'></div>
					<div className='rounded bg-secondary'></div>
					<div className='rounded bg-accent'></div>
					<div className='rounded bg-neutral'></div>
				</div>
			)}
		</div>
		<span className='text-[11px] font-medium truncate w-full text-center'>
			{theme.charAt(0).toUpperCase() + theme.slice(1)}
		</span>
	</button>
);

/**
 * A dedicated component for rendering the chat UI preview.
 */
const ChatPreview = () => {
	const PREVIEW_MESSAGES = [
		{ id: 1, content: "Hey! How's it going?", isSent: false },
		{ id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
	];

	return (
		<div className='rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg'>
			<div className='p-4 bg-base-200'>
				<div className='max-w-lg mx-auto'>
					<div className='bg-base-100 rounded-xl shadow-sm overflow-hidden'>
						{/* Chat Header */}
						<div className='px-4 py-3 border-b border-base-300 bg-base-100'>
							<div className='flex items-center gap-3'>
								<div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium'>
									J
								</div>
								<div>
									<h3 className='font-medium text-sm'>John Doe</h3>
									<p className='text-xs text-base-content/70'>Online</p>
								</div>
							</div>
						</div>

						{/* Chat Messages */}
						<div className='p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100'>
							{PREVIEW_MESSAGES.map((message) => (
								<div
									key={message.id}
									className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`
                      max-w-[80%] rounded-xl p-3 shadow-sm
                      ${message.isSent ? "bg-primary text-primary-content" : "bg-base-200"}
                    `}
									>
										<p className='text-sm'>{message.content}</p>
										<p
											className={`
                        text-[10px] mt-1.5
                        ${message.isSent ? "text-primary-content/70" : "text-base-content/70"}
                      `}
										>
											12:00 PM
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Chat Input */}
						<div className='p-4 border-t border-base-300 bg-base-100'>
							<div className='flex gap-2'>
								<input
									type='text'
									className='input input-bordered flex-1 text-sm h-10'
									placeholder='Type a message...'
									value='This is a preview'
									readOnly
								/>
								<button className='btn btn-primary h-10 min-h-0'>
									<Send size={18} />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/**
 * The main SettingsPage component.
 */
const SettingPage = () => {
	const { theme } = useThemeStore();
	const { setThemeForCurrentUser,deleteProfile, isUpdatingProfile } = useAuthStore();
	const [isModalOpen, setIsModalOpen] = useState(false);

		const handleDelete = async () => {
		await deleteProfile();
		// The modal will close automatically because the user will be logged out
		// and navigated away from this page.
	};

	return (
		<div className='min-h-screen container mx-auto px-4  pb-8 max-w-5xl'>
			<div className='space-y-6'>
				<div className='flex flex-col gap-1'>
					<h2 className='text-lg font-semibold'>Theme</h2>
					<p className='text-sm text-base-content/70'>Choose a theme for your chat interface</p>
				</div>

				<div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
					{THEMES.map((t) => (
						// Passes the correct function down to the ThemeItem
						<ThemeItem key={t} theme={t} currentTheme={theme} onThemeSelect={setThemeForCurrentUser} />
					))}
				</div>

				<h3 className='text-lg font-semibold mt-8 mb-3'>Preview</h3>
				<ChatPreview />

				{/* Danger Zone for Account Deletion */}
				<div className="mt-12 pt-6 border-t border-error/20">
					<h3 className="text-lg font-bold text-error flex items-center gap-2">
						<ShieldAlert size={20} />
						Danger Zone
					</h3>
					<p className="text-sm text-base-content/70 mt-2 mb-4">
						This action is permanent and cannot be undone. All your messages
						and account data will be permanently removed.
					</p>
					<button
						className="btn btn-error btn-outline"
						onClick={() => setIsModalOpen(true)}
					>
						<Trash2 size={16} />
						Delete My Account
					</button>
				</div>
			</div>
			{/* Confirmation Modal */}
			{isModalOpen && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg text-error">
							Confirm Account Deletion
						</h3>
						<p className="py-4">
							Are you absolutely sure you want to delete your account? This
							action is irreversible.
						</p>
						<div className="modal-action">
							<button className="btn" onClick={() => setIsModalOpen(false)}>
								Cancel
							</button>
							<button
								className={`btn btn-error ${isUpdatingProfile ? "loading" : ""}`}
								onClick={handleDelete}
								disabled={isUpdatingProfile}
							>
								Yes, Delete My Account
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default SettingPage;
