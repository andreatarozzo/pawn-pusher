const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      'player-one': '#99d9ea',
      'player-two': '#f5b54f',
      'scrollbar-background': '#36435a',
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    plugin(({ addVariant, e }) => {
      addVariant('not-first', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          const element = e(`not-first${separator}${className}`);
          return `.${element}:not(:first-child)`;
        });
      });
    }),
  ],
};
