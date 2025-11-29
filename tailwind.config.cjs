module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#7c3aed',
        muted: '#6b7280'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 6px 18px rgba(17,24,39,0.08)',
        'soft-md': '0 10px 30px rgba(17,24,39,0.08)'
      }
    },
  },
  plugins: [],
}
