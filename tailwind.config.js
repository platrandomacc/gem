/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#03080C', // Ultra-deep oceanic black
        panel: '#071520', // Cyber-teal deep panel
        panelAlt: '#0C202F', // Luminous oceanic teal-slate
        gold: '#00F5FF', // Electrified Hyper-Cyan / Aqua
        amber: '#14B8A6', // Intensely vibrant Sea Teal
        green: '#10B981', // Glowing Emerald / Mint
        textMuted: '#64748B',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0, 0, 0, 0.28)',
      },
      borderRadius: {
        xl2: '1.125rem',
      },
    },
  },
  plugins: [],
};
