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
          DEFAULT: '#4debacff',
          light: '#d7ebe3ff',
          dark: '#1e9061ff',
          glow: 'rgba(77, 235, 172, 0.7)',
          shadow: 'rgba(30, 144, 97, 0.2)',
          frosted: 'rgba(215, 235, 227, 0.3)',
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