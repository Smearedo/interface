/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: '#27272a',
        input: '#27272a',
        ring: '#d4d4d8',
        background: '#09090b',
        foreground: '#fafafa',
        theme: '#e5204c',
        primary: {
          DEFAULT: '#fafafa',
          foreground: '#18181b'
        },
        secondary: {
          DEFAULT: '#27272a',
          foreground: '#fafafa'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa'
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa'
        },
        accent: {
          DEFAULT: '#27272a',
          foreground: '#fafafa'
        },
        popover: {
          DEFAULT: '#09090b',
          foreground: '#fafafa'
        },
        card: {
          DEFAULT: '#09090b',
          foreground: '#fafafa'
        }
      },
      borderRadius: {
        lg: 8,
        md: 6,
        sm: 4
      },
      fontFamily: {
        sans: ['Nunito'],
        mono: ['GeistMono']
      }
    }
  },
  plugins: []
}
