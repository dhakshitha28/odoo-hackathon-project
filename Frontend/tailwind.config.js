/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c2652a',
          50: '#fbe8d8',
          100: '#f0a878',
          200: '#e08850',
          300: '#c2652a',
          400: '#8a4518',
          500: '#401a08',
        },
        background: '#faf5ee',
        surface: {
          DEFAULT: '#faf5ee',
          dim: '#dcd6cc',
          bright: '#faf5ee',
          container: {
            lowest: '#ffffff',
            low: '#f6f0e8',
            DEFAULT: '#f2ece4',
            high: '#ece6dc',
            highest: '#e6e0d6',
          },
        },
        'on-surface': '#3a302a',
        'on-surface-variant': '#605850',
        outline: {
          DEFAULT: '#9a9088',
          variant: '#d8d0c8',
        },
        'on-primary': '#ffffff',
        error: {
          DEFAULT: '#c0392b',
          container: '#fce4e0',
        },
        'on-error': '#ffffff',
        'on-error-container': '#7a1a10',
        'status-present': '#36B37E',
        'status-absent': '#FF5630',
        'status-break': '#FFAB00',
        tertiary: {
          DEFAULT: '#8c3c3c',
          container: '#d47070',
          fixed: '#fce0e0',
          'fixed-dim': '#e8a0a0',
        },
        secondary: {
          DEFAULT: '#78706a',
          container: '#eae2da',
          fixed: '#eae2da',
          'fixed-dim': '#cec6be',
        },
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      fontFamily: {
        headline: ['"EB Garamond"', 'serif'],
        display: ['"EB Garamond"', 'serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
      },
      spacing: {
        'stack-sm': '0.75rem',
        'stack-md': '1.5rem',
        'stack-lg': '2rem',
        'margin-mobile': '1rem',
      },
      boxShadow: {
        soft: '0 2px 16px rgba(58, 48, 42, 0.04)',
        card: '0 2px 16px rgba(58, 48, 42, 0.04)',
        'card-hover': '0 4px 24px rgba(58, 48, 42, 0.08)',
        dropdown: '0 10px 15px -3px rgba(58, 48, 42, 0.08)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
