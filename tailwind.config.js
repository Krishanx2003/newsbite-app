/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,tsx,ts,jsx}',
    './components/**/*.{js,tsx,ts,jsx}',
    './hooks/**/*.{js,tsx,ts,jsx}',
  ],
  
  // ✅ Enable dark mode with 'class' strategy
  darkMode: 'class',
  
  theme: {
    extend: {
      // ✅ Your app's brand colors
      colors: {
        primary: {
          50: '#FEF3F2',
          100: '#FEE5E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#FF6B35', // Main brand color
          600: '#E85D2F',
          700: '#C74D26',
          800: '#A03F1E',
          900: '#7C3118',
        },
        // ✅ Custom dark mode colors
        dark: {
          bg: '#111827',      // Background
          card: '#1F2937',    // Card background
          border: '#374151',  // Borders
          text: '#F9FAFB',    // Primary text
          muted: '#9CA3AF',   // Secondary text
        },
        // ✅ Custom light mode colors
        light: {
          bg: '#F9FAFB',      // Background
          card: '#FFFFFF',    // Card background
          border: '#E5E7EB',  // Borders
          text: '#1F2937',    // Primary text
          muted: '#6B7280',   // Secondary text
        },
      },
      
      // ✅ Consistent spacing for your app
      spacing: {
        'safe': '20px',
      },
      
      // ✅ Custom shadows for cards
      boxShadow: {
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
      },
      
      // ✅ Custom border radius to match your design
      borderRadius: {
        'card': '12px',
        'button': '20px',
      },
    },
  },
  plugins: [],
};