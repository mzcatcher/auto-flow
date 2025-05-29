module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        telegram: {
          blue: '#0088cc',
          dark: '#1e1e1e',
          secondary: '#8e8e93'
        }
      }
    },
  },
  plugins: [],
}