/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      
    },
    extend: {
      boxShadow: {
        'lg-card': '4px 6px -1px rgba(205, 120, 245, 0.3)'
      }
    },
  },
  plugins: [],
}

