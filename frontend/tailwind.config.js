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
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5e1',
          300: '#94a3b8',
          400: '#64748b',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
        },
        'accent': {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
        }
      },
      boxShadow: {
        'glass-glow': '0 0 15px rgba(203, 213, 225, 0.4)',
        'glass-shadow': '0 8px 32px rgba(15, 23, 42, 0.2)',
        'glass-border': '0 0 0 1px rgba(203, 213, 225, 0.4)',
        'glass-highlight': '0 0 15px rgba(203, 213, 225, 0.3), inset 0 0 20px rgba(203, 213, 225, 0.2)',
        'glass-inner': 'inset 0 0 20px rgba(203, 213, 225, 0.15)',
        'glass-depth': '0 10px 30px -10px rgba(15, 23, 42, 0.3)',
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
        'glass-gradient': 'linear-gradient(135deg, rgba(226, 232, 240, 0.3) 0%, rgba(148, 163, 184, 0.1) 100%)',
        'glass-radial': 'radial-gradient(circle at center, rgba(148, 163, 184, 0.2) 0%, rgba(226, 232, 240, 0.05) 100%)',
        'glass-shine': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 100%)',
        'glass-border-gradient': 'linear-gradient(90deg, rgba(148, 163, 184, 0.7) 0%, rgba(226, 232, 240, 0.5) 50%, rgba(148, 163, 184, 0.7) 100%)'
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
            borderColor: 'rgba(148, 163, 184, 0.5)',
            boxShadow: '0 0 15px rgba(148, 163, 184, 0.3)'
          },
          '50%': { 
            borderColor: 'rgba(148, 163, 184, 0.8)',
            boxShadow: '0 0 20px rgba(148, 163, 184, 0.6)'
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