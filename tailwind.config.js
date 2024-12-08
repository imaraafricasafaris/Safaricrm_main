/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontSize: {
        'nav': '1.125rem', // 18px for sidebar navigation
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: {
          DEFAULT: '#9EFF00',
          50: '#F4FFE6',
          100: '#E6FFCC',
          200: '#CCFF99',
          300: '#B3FF66',
          400: '#9EFF00',
          500: '#7ACC00',
          600: '#669900',
          700: '#4D7300',
          800: '#334D00',
          900: '#1A2600'
        }
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.masonry': {
          'column-count': 'auto',
          'column-gap': '1.5rem',
          'orphans': '1',
          'widows': '1',
          '& > *': {
            'break-inside': 'avoid',
            'margin-bottom': '1.5rem'
          }
        }
      })
    }
  ],
}