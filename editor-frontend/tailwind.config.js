/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#FF42A5",
        additional: { warning: "#DE5A48", link: "#0397EB" },
        background: "#EEEDF0",
        base: { 50: "#E3DFEC", 900: "#0B0223" },
        surface: "#FAFAFB",
        translucent: { black: { 20: "#00000033", 80: "#000000CC" } },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
