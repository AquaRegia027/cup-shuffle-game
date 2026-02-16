import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        sea: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B3D4FF',
          300: '#80B8FF',
          400: '#4D9CFF',
          500: '#1A80FF',
          600: '#0066E0',
          700: '#004DB3',
          800: '#003380',
          900: '#0A1628',
          950: '#060E1A',
        },
        cream: {
          50: '#FEFFFE',
          100: '#F8FAFB',
          200: '#F0F4F8',
          300: '#E2E8F0',
          400: '#CBD5E1',
        },
        accent: {
          gold: '#FFD700',
          correct: '#22C55E',
          wrong: '#EF4444',
        },
      },
      borderRadius: {
        btn: '12px',
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s ease-out',
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
