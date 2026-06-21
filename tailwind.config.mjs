/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core operations-center palette. Named tokens instead of raw
        // hex everywhere so the theme can be retuned from one place.
        neon: "#39FF14",       // primary signal color — CTAs, active states
        "neon-bright": "#00FF7F", // secondary glow — success / live states
        void: "#050505",       // page background
        charcoal: {
          deep: "#111111",     // panel background
          DEFAULT: "#1A1A1A",  // card background
        },
        danger: "#FF3B3B",     // time's up / critical warning only
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        "neon-sm": "0 0 8px rgba(57,255,20,0.35)",
        "neon-md": "0 0 20px rgba(57,255,20,0.45)",
        "neon-lg": "0 0 45px rgba(57,255,20,0.35)",
        "danger-md": "0 0 25px rgba(255,59,59,0.5)",
      },
      animation: {
        "pulse-glow": "pulseGlow 1.4s ease-in-out infinite",
        "drift": "drift 60s linear infinite",
        "drift-slow": "drift 120s linear infinite",
        "scan": "scan 4s linear infinite",
        "flicker": "flicker 3s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255,59,59,0.4)", opacity: "1" },
          "50%": { boxShadow: "0 0 35px rgba(255,59,59,0.85)", opacity: "0.85" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "100%": { transform: "translate(-15%,-10%)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.6" },
          "94%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
