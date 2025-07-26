

import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Settings, User } from "lucide-react";

const Navbar = () => {
	const { logout, authUser } = useAuthStore();

	// This function now uses theme-aware classes for the active state.
	const getNavLinkClass = ({ isActive }) => {
		const baseClasses = "btn btn-sm btn-ghost gap-2 transition-colors";
		// Active state now uses the theme's primary color for its background and text.
		const activeClasses = "bg-primary text-primary-content";

		// The inactive state will inherit its color from the parent div.
		// The hover state is handled automatically by the btn-ghost class.
		return `${baseClasses} ${isActive ? activeClasses : ""}`;
	};

	return (
		<header
			className='
                fixed top-0 left-0 right-0 z-40 
                bg-black/30 backdrop-blur-lg 
                border-b border-l border-r border-gray-500/30
                rounded-b-2xl
            '
		>
			<div className='container mx-auto px-4 h-16'>
				<div className='flex items-center justify-between h-full'>
					{/* Logo and App Name */}
					<div className='flex items-center gap-8'>
						<Link to='/' className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
							<img
								src='https://firebasestorage.googleapis.com/v0/b/gemini-canvas-prod.appspot.com/o/us-central1%3A01a0e132-710e-4422-bffc-389748575c0d?alt=media&token=48927e1f-4999-4c17-814c-83b68071e626'
								alt='EchoChat Logo'
								className='w-9 h-9'
								onError={(e) => {
									e.currentTarget.onerror = null; // prevents looping
									e.currentTarget.src = "https://placehold.co/36x36/111827/FFFFFF?text=E";
								}}
							/>
							<h1 className='text-lg font-bold text-white'>EchoChat</h1>
						</Link>
					</div>

					{/* Action Buttons */}
					<div className='flex items-center gap-2 text-white'>
						{/* All user-specific links are now inside this block */}
						{authUser && (
							<>
								<NavLink to={"/setting"} className={getNavLinkClass}>
									<Settings className='w-4 h-4' />
									<span className='hidden sm:inline'>Settings</span>
								</NavLink>
								<NavLink to={"/profile"} className={getNavLinkClass}>
									<User className='size-5' />
									<span className='hidden sm:inline'>Profile</span>
								</NavLink>
								<button
									className='btn btn-sm btn-ghost flex gap-2 items-center'
									onClick={logout}
								>
									<LogOut className='size-5' />
									<span className='hidden sm:inline'>Logout</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
export default Navbar;

