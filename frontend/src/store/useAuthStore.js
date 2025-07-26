import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useThemeStore } from "./useThemeStore.js";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development"
      ? "http://localhost:5001/api":"/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  // checkAuth: async () => {
  //   try {
  //     const res = await axiosInstance.get("/auth/check");
  //     set({ authUser: res.data });
  //   } catch (error) {
  //     console.log("Error in checkAuth in useAuthStore.js ", error);
  //     set({ authUser: null });
  //   } finally {
  //     set({ isCheckingAuth: false });
  //   }
  // },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signed up Successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup in useAuthStore ", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  //Gemini
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const authUser = res.data;
      set({ authUser });

      // Restore user's theme from localStorage, or default to 'dark'
      const userTheme = localStorage.getItem(`theme-${authUser._id}`) || "dark";
      useThemeStore.getState().setTheme(userTheme);

      toast.success("Logged in Successfully!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        id: "login-error-toast",
      });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // When a user logs out, reset the theme to a generic default.
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      // Reset to a default theme for the login page
      useThemeStore.getState().setTheme("dark");

      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // When the app loads, check for a user and restore their theme.
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      const authUser = res.data;
      set({ authUser });
      get().connectSocket();

      // Restore user's theme
      const userTheme = localStorage.getItem(`theme-${authUser._id}`) || "dark";
      useThemeStore.getState().setTheme(userTheme);
    } catch (error) {
      set({ authUser: null });
      // If no user, ensure the theme is the default
      useThemeStore.getState().setTheme("dark");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // When the theme is changed, save it under the user's ID.
  setThemeForCurrentUser: (newTheme) => {
    const { authUser } = useAuthStore.getState();
    if (authUser) {
      localStorage.setItem(`theme-${authUser._id}`, newTheme);
      useThemeStore.getState().setTheme(newTheme);
    }
  },

  ///Orginal
  // login: async (data) => {
  //   set({ isLoggingIn: true });
  //   try {
  //     const res = await axiosInstance.post("/auth/login", data);
  //     set({ authUser: res.data });
  //     toast.success("Logged in Successfully!");
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "Invalid credentials or server error.";
  //     toast.error(errorMessage, { id: "login-error-toast" });
  //     console.log("Error in login in useAuthStore ", error);
  //   } finally {
  //     set({ isLoggingIn: false });
  //     //   toast.success("Logged in Successfully!");
  //   }
  // },

  // logout: async () => {
  //   try {
  //     await axiosInstance.post("/auth/logout");
  //     toast.success("Logged out Successfully!");
  //     set({ authUser: null });
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //     console.log("Error in logout in useAuthStore ", error);
  //   } finally {
  //     set({ isLoggingOut: false });
  //     toast.success("Logged out Successfully!");
  //   }
  // },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile picture updated Successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
      console.log("Error in updateProfile in useAuthStore ", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
  deleteProfile: async () => {
    // Reuse the isUpdatingProfile state for loading indication
    set({ isUpdatingProfile: true });
    try {
      await axiosInstance.delete("/auth/delete-profile");
      set({ authUser: null });
      toast.success("Account deleted successfully");
      get().disconnectSocket();
      // Reset theme to the default for the login page
      useThemeStore.getState().setTheme("dark");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  //Socket.io methods

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },




  
}));
