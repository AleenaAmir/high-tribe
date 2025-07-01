import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ["var(--font-gilroy)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        "custom-gray": "#696969",
        "gradient-start": "#257CFF",
        "gradient-end": "#0F62DE",
        "card-green": "#92C64E",
        "card-blue": "#007BFF",
        "card-yellow": "#FFC107",
        "card-orange": "#FB8500",
      },
    },
  },
  plugins: [],
} satisfies Config;
