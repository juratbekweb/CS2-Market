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
          black: "var(--bg-deep-black)",
          navy: "var(--bg-navy)",
          purple: "var(--neon-purple)",
          blue: "var(--electric-blue)",
          green: "var(--emerald-glow)",
          gold: "var(--gold-accent)",
          red: "var(--soft-red)",
        },
        primaryBg: "var(--bg-deep-black)",
        secondaryBg: "var(--bg-navy)",
        glass: "var(--glass-bg)",
        glassBorder: "var(--glass-border)",
        neonBlue: "var(--electric-blue)",
        neonPurple: "var(--neon-purple)",
        neonGreen: "var(--emerald-glow)",
        goldAccent: "var(--gold-accent)",
        premiumRed: "var(--soft-red)",
        textPrimary: "#FFFFFF",
        textSecondary: "#AAB3C5",
        
        surface: "var(--bg-navy)",
        panel: "var(--bg-deep-black)",
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
