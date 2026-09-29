/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deck: {
          bg: '#050508',
          card: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#00F0FF',
          purple: '#8A2BE2',
          neonPink: '#FF007F',
          neonCyan: '#00F0FF',
          neonEmerald: '#00FF9D',
          darkGlass: 'rgba(12, 14, 24, 0.65)'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'liquid-pulse': 'liquidPulse 8s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite alternate',
        'float-reverse': 'floatReverse 12s ease-in-out infinite alternate',
      },
      keyframes: {
        liquidPulse: {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)', opacity: '0.45' },
          '50%': { transform: 'scale(1.15) translate(3%, -3%)', opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        floatSlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '100%': { transform: 'translate(40px, -30px) scale(1.08)' },
        },
        floatReverse: {
          '0%': { transform: 'translate(0px, 0px) scale(1.05)' },
          '100%': { transform: 'translate(-50px, 40px) scale(0.95)' },
        }
      }
    },
  },
  plugins: [],
}
