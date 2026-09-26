/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary, #1e40af)", // Default blue-800
        secondary: "var(--color-secondary, #3b82f6)",
        accent: "var(--color-accent, #fbbf24)",
      }
    },
  },
  plugins: [],
}
