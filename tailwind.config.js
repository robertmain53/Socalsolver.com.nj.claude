/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sunset: {
          50: '#fff9e6',
          100: '#fff2cc',
          200: '#ffe699',
          300: '#ffd966',
          400: '#ffcc33',
          500: '#FFD166',
          600: '#e6bc5c',
          700: '#cc9900',
          800: '#b38800',
          900: '#997700'
        },
        coral: {
          50: '#fff5f5',
          100: '#ffeaea',
          200: '#ffd5d5',
          300: '#ffbfbf',
          400: '#ffaaaa',
          500: '#FFA69E',
          600: '#ff8a82',
          700: '#ff6b61',
          800: '#ff4c3f',
          900: '#ff2d1d'
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#4D9FEC',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        }
      },
      backgroundImage: {
        'gradient-sunset': 'linear-gradient(135deg, #FFD166 0%, #FF8C42 50%, #FFA69E 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #4D9FEC 0%, #76C7C0 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F9C74F 0%, #FFD166 100%)',
        'gradient-coral': 'linear-gradient(135deg, #FF5E5B 0%, #FFA69E 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
