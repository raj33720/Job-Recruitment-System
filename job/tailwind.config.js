/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'Calibri', 'sans-serif'],
        serif: ['Garamond', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['"Courier New"', 'Consolas', 'monospace'],
        script: ['Georgia', '"Brush Script MT"', '"Comic Sans MS"', 'cursive'],
        headings: ['Garamond', 'Cambria', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}
