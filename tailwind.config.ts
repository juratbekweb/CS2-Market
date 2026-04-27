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
        surface: "#060816",
        panel: "#0b1124",
        card: "#111a33",
        line: "#243154",
        glow: "#59f2c4",
        flame: "#ff8e53",
        accent: "#8cf7da",
        muted: "#8da1c9",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(89,242,196,.18), 0 20px 60px rgba(12, 194, 140, .18)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(89,242,196,.18), transparent 30%), linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
      },
      animation: {
        "float-slow": "float 10s ease-in-out infinite",
        pulseline: "pulseline 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseline: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
