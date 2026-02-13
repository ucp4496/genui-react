/** @type {import('tailwindcss').Config} */
export default {
  important: true, // forces all Tailwind utilities to output with !important
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/overrides/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // colors
    { pattern: /!?(bg|text|border)-(red|blue|green|yellow|pink|purple|gray|black|white)-(100|200|300|400|500|600|700|800|900)/ },
    // spacing (m, p, gap)
    { pattern: /!?(m|p|mt|mb|ml|mr|px|py|gap)-[0-9]+/ },
    // text sizes
    { pattern: /!?(text)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/ },
    // font weights
    { pattern: /!?(font)-(thin|light|normal|medium|semibold|bold|extrabold|black)/ },
    // flex/grid utilities
    { pattern: /!?(flex|grid|items|justify|content|self)-.*/ },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
