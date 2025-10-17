/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gray: {
            750: '#2d3748',
            850: '#1a202c',
            950: '#0d1117'
          }
        }
      },
    },
    plugins: [],
  }