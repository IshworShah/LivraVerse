/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo
          dark: '#4338ca',
        },
        secondary: '#f97316', // Orange
        accent: '#8b5cf6', // Purple
      },
    },
  },
  plugins: [],
}