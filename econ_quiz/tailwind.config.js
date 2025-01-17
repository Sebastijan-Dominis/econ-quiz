// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // brand
        'brand': '#ffa550',
        'shade': {
          '100': '#e69500',
          '200': '#cc8400',
          '300': '#b37300',
          '400': '#996300',
          '500': '#805300',
          '600': '#664200',
          '700': '#4d3100',
          '800': '#332100',
          '900': '#191000',
        },
        'tint': {
          '100': '#ffae1a',
          '200': '#ffb733',
          '300': '#ffc04d',
          '400': '#ffc966',
          '500': '#ffd280',
          '600': '#ffdb99',
          '700': '#ffe4b3',
          '800': '#ffedcc',
          '900': '#fff6e6',
        },

        // grays; wg = white gray; bg = black gray
        'gray': '#808080',
        'wg': '#e6e6e6',
        'bg': '#1a1a1a',
        'bgbtn': 'rgba(0, 0, 0, 0.45)',
        'bgform': 'rgba(0, 0, 0, 0.7)'
      },
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif']
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}