const { tr } = require('@faker-js/faker');

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '!./node_modules/**', // Exclude everything in node_modules to speed up builds
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        primary: '#053FB0',
        secondary: '#3071EF',
        white: '#FFFFFF',
        xh: '#262626',
        '8c': '#8C8C8C',
        BF: '#BFBFBF',
        error: {
          DEFAULT: '#AD0000',
          secondary: '#C62828',
        },
        success: {
          DEFAULT: '#146622',
          secondary: '#388E3C',
        },
        gray: {
          100: '#F1F3F5',
          200: '#CFD8DC',
          300: '#AFBAC5',
          400: '#90A4AE',
          500: '#546E7A',
          600: '#091D45',
          700: '#8c8c8c',
        },
      },
      fontFamily: {
        sans: ['Elza', 'var(--font-inter)'],
      },
      borderColor: {
        DEFAULT: '#CFD8DC',
        qh: 'rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        revealVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        revealVertical: 'revealVertical 400ms forwards cubic-bezier(0, 1, 0.25, 1)',
      },
      fontSize: {
        'custom-size-24': '24px',
        'custom-size-12': '12px',
        40: '40px',
        20: '20px',
        13: '13px',
      },
      padding: {
        33: '33px',
        5: '5px',
        20: '20px',
      },
      gap: {
        48: '48px',
        20: '20px',
      },
      screens: {
        lg: '1024px',
        '2xl': '1824px',
      },
      height: {
        455: '455px',
      },
      margin: {
        20: '20px',
      },
      boxShadow: {
        productCard: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
      }
    },
  },

  plugins: [
    // @ts-ignore

    require('tailwindcss-radix')(),
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    function c({ addComponents }) {
      addComponents({
        '[data-state="open"] > .add': {
          display: 'none',
        },
        '[data-state="open"] > .sub': {
          display: 'block',
        },
        '[data-state="closed"] > .add': {
          display: 'block',
        },
        '[data-state="closed"] > .sub': {
          display: 'none',
        },
        '.hide-button-border button': {
          border: 'none',
        },
        '.pointer': {
          cursor: 'pointer',
        },
        '.product-card-image-container:hover .button-contaier': {
          opacity: 1,
          transition: 'all 0.3s ease-in-out',
        }
      });
    },
  ],
};

module.exports = config;
