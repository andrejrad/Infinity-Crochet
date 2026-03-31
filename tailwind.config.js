/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lilac: {
          DEFAULT: '#C8A2C8',
          light: '#E5D4E5',
          dark: '#B08FB0',
        },
        purple: {
          DEFAULT: '#7D3C98',
          light: '#9B59B6',
          dark: '#5B2C6F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'soft': '1.5rem',
      },
    },
  },
  plugins: [],
}
