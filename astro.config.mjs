import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://walls.example.com",
  output: "static",
  integrations: [sitemap()],
  build: {
    assets: "_assets",
  },
  vite: {
    css: {
      postcss: "./postcss.config.mjs",
    },
  },
});
