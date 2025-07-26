// import { create } from 'zustand';

// /**
//  * Zustand store for managing the application's theme.
//  *
//  * @property {string} theme - The current theme name.
//  * @property {function(string): void} setTheme - Action to set a new theme.
//  */
// export const useThemeStore = create((set) => ({
//   // Get the initial theme from localStorage, or default to 'dark'
//   theme: localStorage.getItem('theme') || 'dark',
  
//   // Action to set a new theme
//   setTheme: (newTheme) => {
//     // Save the new theme to localStorage for persistence
//     localStorage.setItem('theme', newTheme);
//     // Update the state in the store
//     set({ theme: newTheme });
//   },
// }));

import { create } from 'zustand';

/**
 * Zustand store for managing the application's theme.
 * The theme is now managed by the useAuthStore to ensure it's
 * tied to the currently authenticated user.
 *
 * @property {string} theme - The current theme name.
 * @property {function(string): void} setTheme - Action to set a new theme.
 */
export const useThemeStore = create((set) => ({
  // Start with a default theme. The auth store will update this.
  theme: 'dark',
  
  // Action to set a new theme in the state
  setTheme: (newTheme) => {
    set({ theme: newTheme });
  },
}));
