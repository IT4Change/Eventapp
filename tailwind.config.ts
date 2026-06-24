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
        coral: '#E87A5D',
        orange: '#F2994A',
        gold: '#F4C95D',
        teal: '#54C0B4',
        blue: '#6BA8D8',
        green: '#9CCC65',
        ink: {
          DEFAULT: '#2E5A57',
          soft: '#4A7672',
        },
        off: '#FBF9F5',
        mist: '#F4F1EB',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        script: ['"Brush Script MT"', '"Lucida Handwriting"', '"Snell Roundhand"', 'cursive'],
      },
      maxWidth: {
        container: '1240px',
      },
      backgroundImage: {
        'grad-warm': 'linear-gradient(120deg, #E87A5D 0%, #F2994A 50%, #F4C95D 100%)',
        'grad-cool': 'linear-gradient(120deg, #6B3410 0%, #C05020 100%)',
        'grad-rainbow': 'linear-gradient(120deg, #6B3410 0%, #C05020 50%, #E8902E 100%)',
        'grad-ceremony': 'linear-gradient(120deg, #F2994A, #54C0B4)',
        'grad-nature': 'linear-gradient(120deg, #9CCC65, #54C0B4)',
        'grad-soulevents': 'linear-gradient(to right, #5A2D0E 0%, #6B3410 28%, #C05020 52%, #DD7B2E 76%, #EFA24E 100%)',
      },
    },
  },
}
