/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Agricultural theme colors
        'grain-green': '#10b981',
        'grain-dark-green': '#047857',
        'grain-yellow': '#fbbf24',
        'grain-orange': '#d97706',
        'grain-cream': '#fefce8',
      },
    },
  },
  plugins: [],
}

