
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useThemeStore } from "./store/useThemeStore.js";
import { Loader } from "lucide-react";
import Lottie from "lottie-react";
import SuccessIcon from "./animations/SuccessIcon.json";
import FailedIcon from "./animations/FailedIcon.json";
import { Toaster } from "react-hot-toast";

// Components
import Navbar from "./components/Navbar.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import SettingPage from "./pages/SettingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

/**
 * This component is now defined outside of App to prevent re-declaration on every render.
 * It listens to the theme store and applies the current theme to the root <html> element.
 */
const ThemeController = () => {
	const { theme } = useThemeStore();

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	return null; // This component renders no visible UI
};

const App = () => {
	const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);



	// The loading state should only depend on isCheckingAuth
	if (isCheckingAuth) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<Loader className='size-10 animate-spin' />
			</div>
		);
	}

	return (
		// This div is now the main layout container
		<div className='flex flex-col h-screen'>
			<ThemeController />
			<Navbar />
			
			{/* The main content area is now the only scrollable part */}
			<main className='flex-1 overflow-y-auto pt-24'>
				<div className='container mx-auto'>
					<Routes>
						<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
						<Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
						<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
						<Route path='/setting' element={authUser ? <SettingPage /> : <Navigate to='/login' />} />
						<Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
					</Routes>
				</div>
			</main>

			<Toaster
				position='top-center'
				reverseOrder={false}
				toastOptions={{
					duration: 3500,
					error: {
						icon: <Lottie animationData={FailedIcon} loop={false} style={{ height: "30px", width: "30px" }} speed={2} />,
						style: {
							background: "rgba(0, 14, 14, 0.2)",
							backdropFilter: "blur(10px)",
							WebkitBackdropFilter: "blur(10px)",
							color: "#c9c9c9",
							border: "1px solid rgba(196, 2, 2, 0.2)",
							borderRadius: "10px",
						},
					},
					success: {
						icon: <Lottie animationData={SuccessIcon} loop={false} style={{ height: "35px", width: "35px" }} speed={2} />,
						style: {
							background: "rgba(0, 14, 14, 0.2)",
							backdropFilter: "blur(10px)",
							WebkitBackdropFilter: "blur(10px)",
							color: "#c9c9c9",
							border: "1px solid rgba(0, 255, 76, 0.2)",
							borderRadius: "10px",
						},
					},
				}}
			/>
		</div>
	);
};

export default App;
