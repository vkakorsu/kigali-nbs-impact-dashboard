import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Static output keeps the dashboard low-bandwidth and easy to host anywhere:
// the Vercel demo today, the Rwanda Forestry Authority's hosting arrangement
// at the National Data Center tomorrow. No server runtime, no vendor lock-in.
export default defineConfig({
  output: "static",
  site: "https://kigali-nbs-impact-dashboard.vercel.app",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
