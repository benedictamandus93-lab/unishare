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
        board: {
          DEFAULT: "#EBEEE8",
          deep: "#DDE2D9",
          line: "#CDD4C7",
        },
        card: "#FFFFFF",
        ink: {
          DEFAULT: "#16211C",
          soft: "#4C5A53",
          faint: "#7C8880",
        },
        varsity: {
          DEFAULT: "#0A3D62",
          deep: "#062B45",
        },
        buy: { ink: "#12539E", wash: "#E2ECF9" },
        rent: { ink: "#1F6F4A", wash: "#E0F0E7" },
        services: { ink: "#B01B60", wash: "#FBE2ED" },
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "system-ui", "sans-serif"],
        sans: ["'Instrument Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pin: "0 1px 0 0 rgba(22,33,28,0.06), 0 10px 22px -14px rgba(22,33,28,0.45)",
        lift: "0 2px 0 0 rgba(22,33,28,0.06), 0 20px 36px -20px rgba(22,33,28,0.5)",
      },
      borderRadius: {
        sheet: "3px",
      },
      maxWidth: {
        wall: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
