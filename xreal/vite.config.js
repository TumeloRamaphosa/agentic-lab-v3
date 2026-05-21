import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    // dev-only proxy so `npm run dev` can reach the TTS server if it's running
    proxy: { "/tts": "http://localhost:4321" },
  },
  build: { outDir: "dist", emptyOutDir: true },
});
