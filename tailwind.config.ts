import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        offwhite: "#f8f8f8",
        hairline: "#e5e5e5",
        grayed: "#8e8e93",
        lime: "#ccff00",
        cyan: "#00e5ff",
        brandblue: "#2563eb",
        navy: "#0b0d10",
        pinkish: "#ff3b60",
        mint: "#00d26a",
        skyblue: "#70a6ff",
        background: "#ffffff",
        foreground: "#141414",
        border: "#e5e5e5",
        muted: {
          DEFAULT: "#f8f8f8",
          foreground: "#666666",
        },
      },
      fontFamily: {
        display: ["Inter Tight", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
