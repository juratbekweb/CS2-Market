/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#1a1a2e',
        'bg-tertiary': '#16213e',
        'accent-primary': '#00ff88',
        'accent-secondary': '#ff6b6b',
        'accent-tertiary': '#4ecdc4',
        'accent-yellow': '#ffd93d',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0',
        'text-muted': '#6b6b6b',
        'border-color': '#2a2a3e',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 255, 136, 0.3)',
        'glow-strong': '0 0 30px rgba(0, 255, 136, 0.5)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 20px rgba(0, 255, 136, 0.5)' },
          '100%': { textShadow: '0 0 30px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

