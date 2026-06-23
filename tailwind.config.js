/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 16px 40px rgba(0,0,0,.45)',
        glow: '0 0 25px rgba(244,114,182,.28)',
      }
    },
  },
  plugins: [],
};
