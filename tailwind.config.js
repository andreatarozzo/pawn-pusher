const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
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
