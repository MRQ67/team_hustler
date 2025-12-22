/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#D34E4E",
        accent: "#F9E7B2",
        "background-light": "#f8f6f6",
        "background-dark": "#1f1313",
        "glass-surface": "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        display: ["Manrope_700Bold"],
        body: ["DMSans_400Regular"],
        "dm-regular": ["DMSans_400Regular"],
        "dm-medium": ["DMSans_500Medium"],
        "dm-bold": ["DMSans_700Bold"],
        "manrope-regular": ["Manrope_400Regular"],
        "manrope-medium": ["Manrope_500Medium"],
        "manrope-semibold": ["Manrope_600SemiBold"],
        "manrope-bold": ["Manrope_700Bold"],
      },
    },
  },
  plugins: [],
};