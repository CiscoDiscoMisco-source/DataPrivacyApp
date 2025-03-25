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
          50: '#f0fdf4',
          100: '#d7ebe3',
          200: '#b3d7c7',
          300: '#8fc3ab',
          400: '#6baf8f',
          500: '#4debac',
          600: '#1e9061',
          700: '#1a7a54',
          800: '#166447',
          900: '#124e3a',
        },
      },
      boxShadow: {
        'glass-glow': '0 0 15px rgba(77, 235, 172, 0.5)',
        'glass-shadow': '0 8px 32px rgba(30, 144, 97, 0.2)',
        'glass-border': '0 0 0 1px rgba(77, 235, 172, 0.5)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(215, 235, 227, 0.3) 0%, rgba(77, 235, 172, 0.1) 100%)',
      },
    },
  },
  plugins: [],
} 