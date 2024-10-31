import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import { color } from "framer-motion";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customBlue: "#02001a",
        customFiap: "#F1008B",
      },
      backgroundColor:{
        "blue-1000": "#02001a",
      },
      textColor:{
        corfiap: "##F1008B",
      },
    },
  },
  plugins: [ typography , forms],
};
export default config;
