import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#020204",
          navy: "#05050a",
          purple: "#a100ff",
          blue: "#00f0ff",
          green: "#00ff87",
          gold: "#ffaa00",
          red: "#ff2a5f",
        },
        primaryBg: "#020204",
        secondaryBg: "#05050a",
        glass: "rgba(5, 5, 10, 0.65)",
        glassBorder: "rgba(255, 255, 255, 0.05)",
        neonBlue: "#00f0ff",
        neonPurple: "#a100ff",
        neonGreen: "#00ff87",
        goldAccent: "#ffaa00",
        premiumRed: "#ff2a5f",
        textPrimary: "#FFFFFF",
        textSecondary: "#AAB3C5",
        
        surface: "#05050a",
        panel: "#020204",
        muted: "#AAB3C5",
      },
      boxShadow: {
        'neon-blue': "0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)",
        'neon-purple': "0 0 10px rgba(77, 0, 255, 0.5), 0 0 20px rgba(77, 0, 255, 0.3)",
        'neon-gold': "0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)",
        'neon-green': "0 0 10px rgba(0, 255, 102, 0.5), 0 0 20px rgba(0, 255, 102, 0.3)",
        'glass': "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-orbitron)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
