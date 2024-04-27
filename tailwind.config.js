const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: '',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  theme: {
    fontFamily: {
      'sans': ['Proximal Nova', ...defaultTheme.fontFamily.sans],
      'poppins': ["Poppins", "sans-serif"],
      'inter': ["Inter", "sans-serif"],
      'allura': ["Allure", "sans-serif"],
      'Jakarta': ["Plus Jakarta Sans"]
    },
    /*
    screens: {
      'sm': { 'min': '640px', 'max': '767px'},
      'md': { 'min': '768px', 'max': '1023px'},
      'lg': { 'min': '1024px', 'max': '1279px'},
      'xl': { 'min': '1280px', 'max': '1535px'},
      '2xl': { 'min': '1536px'},
    },
    */
    extend:
      {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'jakarta': ['Jakarta', 'sans-serif']
        },
        screens: {
          'xxs': {'max': '439px'},
          'xs': {'min': '440px', 'max': '639px'},
        }
      },
  },
  plugins: [
    require('flowbite/plugin') // add this line
  ],

}
