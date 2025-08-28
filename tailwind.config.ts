import type { Config } from 'tailwindcss'
import scrollbar from 'tailwind-scrollbar'

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['var(--font-gilroy)', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        'custom-gray': '#696969',
        'gradient-start': '#257CFF',
        'gradient-end': '#0F62DE',
        'card-green': '#92C64E',
        'card-blue': '#007BFF',
        'card-yellow': '#FFC107',
        'card-orange': '#FB8500',
      },
    },
  },
  plugins: [scrollbar],
} satisfies Config
