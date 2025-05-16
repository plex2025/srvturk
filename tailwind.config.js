/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-750': '#2d3748', // Custom color between gray-700 and gray-800
      },
      animation: {
        'loading-bar': 'loading 2s infinite',
      },
      keyframes: {
        loading: {
          '0%': { width: '0%', left: '0%' },
          '50%': { width: '100%', left: '0%' },
          '100%': { width: '0%', left: '100%' },
        }
      },
    },
  },
  plugins: [],
};