/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#1e9061',
          50: '#f0f9f5',
          100: '#d7ebe3',
          200: '#b0d7c7',
          300: '#80bfa6',
          400: '#4fa586',
          500: '#1e9061',
          600: '#167552',
          700: '#125e42',
          800: '#0e4933',
          900: '#0a3b29',
          950: '#052117',
        },
      },
      boxShadow: {
        'neu-flat': '6px 6px 12px #b8cec6, -6px -6px 12px #ffffff',
        'neu-pressed': 'inset 6px 6px 12px #b8cec6, inset -6px -6px 12px #ffffff',
        'neu-concave': 'inset 6px 6px 12px #b8cec6, -6px -6px 12px #ffffff',
        'neu-border': '0 0 0 2px #1e9061',
      },
    },
  },
  plugins: [],
} 