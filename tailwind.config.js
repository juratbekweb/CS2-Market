/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'bg-tertiary': 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        'accent-primary': 'rgb(var(--color-accent-primary) / <alpha-value>)',
        'accent-secondary': 'rgb(var(--color-accent-secondary) / <alpha-value>)',
        'accent-tertiary': 'rgb(var(--color-accent-tertiary) / <alpha-value>)',
        'accent-yellow': 'rgb(var(--color-accent-yellow) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'border-color': 'rgb(var(--color-border) / <alpha-value>)',
      },
      boxShadow: {
        'glow': '0 0 20px rgb(var(--color-accent-primary) / 0.3)',
        'glow-strong': '0 0 30px rgb(var(--color-accent-primary) / 0.5)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 20px rgb(var(--color-accent-primary) / 0.5)' },
          '100%': { textShadow: '0 0 30px rgb(var(--color-accent-primary) / 0.8), 0 0 40px rgb(var(--color-accent-primary) / 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

