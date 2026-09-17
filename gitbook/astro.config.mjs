import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://testingandsecurity.nilsmertens.dev",
  output: "static",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Paired themes so code blocks follow the light/dark toggle. With
      // defaultColor: false Shiki emits --shiki-light/--shiki-dark (and their
      // -bg) custom properties instead of fixed colours; markdown.css picks
      // which one applies.
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
      wrap: true,
    },
  },
});