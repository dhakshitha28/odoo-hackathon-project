/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c2652a',
          50: '#fdf5ee',
          100: '#fbe8d5',
          200: '#f6ceaa',
          300: '#f0ad74',
          400: '#e8863d',
          500: '#c2652a',
          600: '#a44e1e',
        },
        ink: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          faint: '#A8A29E',
        },
        cream: {
          DEFAULT: '#F6F1EB',
          deep: '#EDE6DC',
        },
        present: '#16A34A',
        leave: '#2563EB',
        absent: '#CA8A04',
        error: {
          DEFAULT: '#DC2626',
          container: '#FEE2E2',
        },
        background: '#F6F1EB',
        surface: {
          DEFAULT: '#FFFFFF',
          dim: '#EDE6DC',
          bright: '#FFFFFF',
          container: {
            lowest: '#FFFFFF',
            low: '#FBF8F4',
            DEFAULT: '#F3EEE7',
            high: '#EBE4DA',
            highest: '#E3DBD0',
          },
        },
        'on-surface': '#1C1917',
        'on-surface-variant': '#57534E',
        outline: {
          DEFAULT: '#A8A29E',
          variant: '#E7E0D6',
        },
        'on-primary': '#FFFFFF',
        'on-error': '#FFFFFF',
        'on-error-container': '#7F1D1D',
        'status-present': '#16A34A',
        'status-absent': '#CA8A04',
        'status-break': '#CA8A04',
        'primary-container': '#fbe8d5',
        'on-primary-container': '#4a2008',
        secondary: {
          DEFAULT: '#78716C',
          container: '#F0EBE4',
        },
        'on-secondary-container': '#44403C',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        label: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
        boxShadow: {
          soft: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(194, 101, 42, 0.06)',
          card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(194, 101, 42, 0.06)',
          'card-hover': '0 12px 32px rgba(194, 101, 42, 0.12)',
          dropdown: '0 16px 40px rgba(28, 25, 23, 0.12)',
          elevated: '0 20px 50px rgba(194, 101, 42, 0.16)',
        },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
