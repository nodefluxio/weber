module.exports = {
  content: [
    './app/components/**/*.{tsx,ts,jsx,js}',
    './pages/**/*.{tsx,ts,jsx,js}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#dbd0ec',
          200: '#b7a0d9',
          300: '#9471c7',
          400: '#7041b4',
          500: '#4c12a1',
          600: '#3d0e81',
          700: '#2e0b61',
          800: '#1e0740',
          900: '#0f0420'
        },
        customPurple: { 100: '#7f4fa8', 900: '#240a50' },
        secondary: {
          100: '#dafaf1',
          200: '#b5f5e2',
          300: '#8fefd4',
          400: '#6aeac5',
          500: '#45e5b7',
          600: '#37b792',
          700: '#29896e',
          800: '#1c5c49',
          900: '#0e2e25'
        },
        tertiary: '#439dff',
        quaternary: '#eb5e3f',
        error: '#bf1650',
        white: '#fdfdfd '
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Hind', 'serif'],
        code: ['Consolas', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
}
