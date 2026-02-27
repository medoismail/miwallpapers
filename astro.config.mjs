import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://miwallpapers.vercel.app",
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
