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
        primary: '#0053B6',
        secondary: '#3071EF',
        black: '#262626',
        white: '#FFFFFF',
        error: {
          DEFAULT: '#AD0000',
          secondary: '#C62828',
        },
        success: {
          DEFAULT: '#146622',
          secondary: '#388E3C',
        },
        gray: {
          100: '#F0F0F0',
          200: '#F9F9F9',
          300: '#E5E5E5',
          400: '#BFBFBF',
          500: '#8C8C8C',
          600: '#505050',
          700: '#434343',
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
        'tiny': ['12px', { lineHeight: '1.5' }],
        xs: ['13px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '20px' }],
        base:  ['16px', { lineHeight: '1.5' }],
        md: ['18px', { lineHeight: '1' }],
        lg: ['20px', { lineHeight: '1.4' }],
        xl: ['24px', { lineHeight: '1.25' }],
        '2xl': ['30px', { lineHeight: '1.1' }],
        '3xl': ['40px', { lineHeight: '1.1' }],
        '4xl': ['50px', { lineHeight: '1.1' }],
        '5xl': ['90px', { lineHeight: '116px' }]
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
        xs: '380px',
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
        },
        '.product-description .grids .grid-2': {
          marginBottom: '1rem',
        },
        '.product-description .grids .grid-2 h3': {
          fontWeight: 500,
          marginBottom: '4px',
        },
        '.product-description .grids .grid-2 ul': {
          listStyle: 'disc',
          paddingLeft: '1.5rem',
        },
        '.product-description a': {
          textDecoration: 'underline'
        },
        '.product-description a:hover': {
          color: '#0053B6'
        },
        '.product-sustainability .shg-rich-text h4': {
          margin: '0 0 4px'
        },
        '.product-sustainability .shg-rich-text p': {
          margin: '0 0 12px'
        },
        '.product-sustainability .icons-container': {
          position: 'relative',
        },
        '.product-sustainability .icons-container *': {
          position: 'initial !important',
        },
        '.product-sustainability .icon-container .icon-content': {
          width: '100%',
          background: '#fff',
          boxShadow: '0 2px 9px 1px rgba(51,51,51,.2)',
          padding: '4px 12px',
          position: 'absolute !important',
          Left: '10px',
          right: '10px',
          bottom: '105%',
          fontSize: '11px',
          lineHeight: 1.1,
          zIndex: 2,
          display: 'none'
        },
        '.product-sustainability .icon-container .icon-content p': {
          margin: 0
        },
        '.product-sustainability .icon-container:hover .icon-content': {
          display: 'block'
        },
        '.variant-quantity [name="variant-quantity"]': {
          width: '100%',
          height: '50px'
        }
      });
    },
  ],
};

module.exports = config;
