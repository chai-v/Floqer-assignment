/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #8726E7, #B880E0, #E9D9D9, #E9D9D9)',
      },
    },
    colors: {
      'cream': '#FFF7F7',
      'darkcream': '#EDE3E3',
      'purple': '#8727E7',
      'darkpurple': '#461D6F'
    },
  },
  plugins: [],
}
