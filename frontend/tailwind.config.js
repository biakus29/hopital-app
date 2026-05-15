/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          50:  '#eefaf8',
          100: '#d3f2ec',
          200: '#a7e4d8',
          300: '#74cebf',
          400: '#46b3a3',
          500: '#2e9889',
          600: '#207b6f',
          700: '#1b625a',
          800: '#184f49',
          900: '#15413d',
          950: '#082624'
        }
      }
    }
  },
  plugins: []
}
