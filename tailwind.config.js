/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js}","./scripts/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["cupcake", "dark"],
  },
}