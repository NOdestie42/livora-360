/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: "#0582CA",
        primaryHover: "#0467B2",

        // Text Colors
        textPrimary: "#333333",
        textSecondary: "#666666",
        textMuted: "#999999",
        textInverted: "#FFFFFF",

        // Button Colors
        buttonPrimary: "#1E90FF",
        buttonSecondary: "#00B8A9",
        buttonSecondaryHover: "#00998F",

        // Background Colors
        bgMain: "#FFFFFF",
        bgSection: "#F9F9F9",
        bgCard: "#FFFFFF",
        bgFooter: "#04619A",

        // UI Colors
        border: "#E0E0E0",
        focusOutline: "#0582CA",
        highlight: "#0582CA",

        // Status Colors
        success: "#00B894",
        error: "#E74C3C",
        info: "#3498DB",

        // Legacy colors for backward compatibility
        secondary: "#666666",
        textSecondary: "#666666",
      },
    },
  },
};
