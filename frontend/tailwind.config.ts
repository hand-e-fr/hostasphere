import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  }, daisyui: {
    themes: [
      {
        hande_dark: {
          "primary": "#581c87",
          "secondary": "#7c3aed",
          "accent": "#9333ea",
          "neutral": "#111827",
          "base-100": "#242933",
          "info": "#0079b4",
          "success": "#a3e635",
          "warning": "#f59e0b",
          "error": "#dc2626",
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
export default config;
