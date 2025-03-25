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
        'glass-highlight': '0 0 15px rgba(77, 235, 172, 0.3), inset 0 0 20px rgba(77, 235, 172, 0.2)',
        'glass-inner': 'inset 0 0 20px rgba(77, 235, 172, 0.15)',
        'glass-depth': '0 10px 30px -10px rgba(30, 144, 97, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'glass': '10px',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(215, 235, 227, 0.3) 0%, rgba(77, 235, 172, 0.1) 100%)',
        'glass-radial': 'radial-gradient(circle at center, rgba(77, 235, 172, 0.2) 0%, rgba(215, 235, 227, 0.05) 100%)',
        'glass-shine': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 100%)',
        'glass-border-gradient': 'linear-gradient(90deg, rgba(77, 235, 172, 0.7) 0%, rgba(215, 235, 227, 0.5) 50%, rgba(77, 235, 172, 0.7) 100%)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        borderGlow: {
          '0%, 100%': { 
            borderColor: 'rgba(77, 235, 172, 0.5)',
            boxShadow: '0 0 15px rgba(77, 235, 172, 0.3)'
          },
          '50%': { 
            borderColor: 'rgba(77, 235, 172, 0.8)',
            boxShadow: '0 0 20px rgba(77, 235, 172, 0.6)'
          }
        }
      },
      animation: {
        shimmer: 'shimmer 3s infinite linear',
        pulse: 'pulse 2s infinite ease-in-out',
        borderGlow: 'borderGlow 2s infinite ease-in-out'
      },
    },
  },
  plugins: [],
} 