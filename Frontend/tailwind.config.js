/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#714B67',
          50: '#F4ECF2',
          100: '#E4D0DE',
          200: '#C9A4BB',
          300: '#A57493',
          400: '#714B67',
          500: '#5A3B52',
          600: '#432B3D',
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
        'primary-container': '#F4ECF2',
        'on-primary-container': '#432B3D',
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
        soft: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(113, 75, 103, 0.06)',
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(113, 75, 103, 0.06)',
        'card-hover': '0 12px 32px rgba(113, 75, 103, 0.12)',
        dropdown: '0 16px 40px rgba(28, 25, 23, 0.12)',
        elevated: '0 20px 50px rgba(113, 75, 103, 0.16)',
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
