/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MEDIGEN Core Palette
        ivory: '#FDFBF7',
        'sage-green': '#8A9A86',
        'muted-teal': '#4A7C7D',
        'soft-mint': '#D1E7DD',
        lavender: '#E2D9F3',
        'muted-peach': '#F8D7DA',
        charcoal: '#2B2D42',

        // Extended Haute-Clinical Palette from Stitch Design Spec
        primary: {
          DEFAULT: '#214B4C',
          container: '#3A6364',
          fixed: '#BFEBEB',
          light: '#4A7C7D',
          hover: '#193A3B'
        },
        secondary: {
          DEFAULT: '#536251',
          container: '#D4E4CE',
          sage: '#8A9A86',
          fixed: '#D7E7D1'
        },
        tertiary: {
          DEFAULT: '#4D3D66',
          container: '#65547F',
          lavender: '#E2D9F3',
          core: '#7C6A96',
          fixed: '#ECDCFF'
        },
        surface: {
          DEFAULT: '#FDFBF7',
          dim: '#D7D8F4',
          container: '#EDECFF',
          'container-low': '#F4F2FF',
          'container-high': '#E6E6FF',
          'container-lowest': '#FFFFFF',
          'container-highest': '#E0E0FC',
          variant: '#E0E0FC',
          wash: '#F4F0E8'
        },
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
          peach: '#F8D7DA'
        }
      },
      fontFamily: {
        headline: ['"Bodoni Moda"', 'serif'],
        display: ['"Bodoni Moda"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'DEFAULT': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        'full': '9999px'
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        'space-xxl': '4rem',
        'margin': '2.5rem',
        'gutter': '1.5rem'
      },
      boxShadow: {
        'clinical-card': '0 4px 16px -2px rgba(58,99,100,0.06), 0 2px 6px -1px rgba(43,45,66,0.03)',
        'clinical-elevated': '0 12px 32px -4px rgba(58,99,100,0.1), 0 4px 12px -2px rgba(43,45,66,0.04)',
        'clinical-drawer': '0 20px 40px -8px rgba(58,99,100,0.12), 0 8px 16px -4px rgba(43,45,66,0.04)'
      }
    },
  },
  plugins: [],
}

