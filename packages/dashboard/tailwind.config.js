module.exports = {
  darkMode: false, // or 'media' or 'class'
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/antd/dist/antd.css',
  ],
  theme: {
    extend: {
      maxHeight: {
        0: '0',
        '1/4': '25vh',
        '1/2': '50vh',
        '3/4': '75vh',
      },
      zIndex: {
        '-10': '-10',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
