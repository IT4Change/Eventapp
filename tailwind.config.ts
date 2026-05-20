import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        cacao: {
          DEFAULT: '#6B3410',
          dark: '#3A1F0E',
        },
        rust: '#C25E2A',
        saffron: {
          DEFAULT: '#D4A047',
          light: '#F2D9A8',
        },
        olive: {
          DEFAULT: '#7A8B4A',
          dark: '#5A6938',
        },
        sand: '#F7EFE0',
        cream: '#FAF6EE',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', '"Times New Roman"', 'serif'],
        script: ['"Dancing Script"', '"Brush Script MT"', '"Lucida Handwriting"', '"Snell Roundhand"', 'cursive'],
      },
      maxWidth: {
        container: '1240px',
      },
    },
  },
}
