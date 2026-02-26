/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: '#888888',
        subtle: '#444444',
        line: '#222222',
        surface: '#0a0a0a',
        ink: '#ffffff',
        danger: '#ff3b30',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}