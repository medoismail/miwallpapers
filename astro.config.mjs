import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://miwallpapers.vercel.app",
  output: "hybrid",
  adapter: vercel(),
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
