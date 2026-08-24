import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#fdf6f4" },
          100: { value: "#faeae6" },
          200: { value: "#f5dada" },
          300: { value: "#e8b8b8" },
          400: { value: "#d49090" },
          500: { value: "#c47878" },
          600: { value: "#a85555" },
          700: { value: "#8b3a3a" },
          800: { value: "#6b2a2a" },
          900: { value: "#4a1a1a" },
          950: { value: "#2c0f0f" },
        },
      },
      fonts: {
        // Material Design 3 typography:
        // Roboto Serif for headings (display/headline roles)
        // Roboto Flex for body text, with Noto as fallback for non-Latin scripts
        heading: {
          value: `var(--font-roboto-serif), 'Roboto Serif', Georgia, serif`,
        },
        body: {
          value: `var(--font-roboto-flex), 'Roboto Flex', Roboto, Noto, sans-serif`,
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.700}" },
          contrast: { value: "{colors.brand.50}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.700}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
