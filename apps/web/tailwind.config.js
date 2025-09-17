const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'app/**/*.{ts,tsx,js,jsx}'),
    join(__dirname, '../../packages/ui/src/**/*.{ts,tsx,js,jsx}')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
