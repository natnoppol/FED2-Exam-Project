// tailwind.config.js (updated for ES module)
export default {
    content: [
      './src/**/*.{html,js,jsx,ts,tsx}',
      './public/index.html',
    ],
    theme: {
      extend: {
        animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
      }, keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      },
    },
    plugins: [],
  };
  