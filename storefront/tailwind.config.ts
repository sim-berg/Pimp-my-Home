import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mystical Crystal Cave Palette
        cave: {
          darkest: '#050508',
          dark: '#0a0a0f',
          deep: '#12121a',
          medium: '#1a1a2e',
          light: '#25253a',
          lighter: '#2f2f4a',
        },
        crystal: {
          purple: '#7c3aed',
          'purple-light': '#a78bfa',
          'purple-dark': '#5b21b6',
          teal: '#14b8a6',
          'teal-light': '#2dd4bf',
          'teal-dark': '#0d9488',
          pink: '#ec4899',
          'pink-light': '#f472b6',
          blue: '#3b82f6',
          'blue-light': '#60a5fa',
          gold: '#f59e0b',
        },
        glow: {
          purple: '#a855f7',
          teal: '#2dd4bf',
          pink: '#f472b6',
        },
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.4)',
        'glow-purple-lg': '0 0 40px rgba(168, 85, 247, 0.5)',
        'glow-teal': '0 0 20px rgba(45, 212, 191, 0.4)',
        'glow-teal-lg': '0 0 40px rgba(45, 212, 191, 0.5)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.4)',
        'glow-sm': '0 0 10px rgba(168, 85, 247, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(168, 85, 247, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'crystal-gradient': 'linear-gradient(135deg, #7c3aed 0%, #14b8a6 100%)',
        'crystal-gradient-vertical': 'linear-gradient(180deg, #7c3aed 0%, #14b8a6 100%)',
        'cave-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.2) 50%, transparent 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
