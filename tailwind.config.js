/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1a2e',
          card: '#16213e',
        },
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        accent: {
          DEFAULT: '#06b6d4',
          hover: '#0891b2',
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Almarai', 'Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
