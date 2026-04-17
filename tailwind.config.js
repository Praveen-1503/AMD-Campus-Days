/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0e0e0e',
        surface_container_lowest: '#000000',
        surface_container_low: '#131313',
        surface_container: '#1a1919',
        surface_container_high: '#201f1f',
        surface_container_highest: '#262626',
        surface_variant: '#262626',
        primary: '#0055FF', // Override primary color from tokens
        primary_dim: '#3467ff',
        primary_container: '#819bff',
        on_primary_container: '#ffffff',
        on_primary: '#ffffff',
        secondary: '#e5e2e1',
        on_surface: '#ffffff',
        outline: '#777575',
        outline_variant: '#494847',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.5rem',
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        full: '9999px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #3467ff 0%, #0055FF 100%)',
      },
      boxShadow: {
        'neon': '0px 10px 30px rgba(0, 85, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
