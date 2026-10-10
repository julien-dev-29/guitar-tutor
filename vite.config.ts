import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: "/guitar-tutor/",
  plugins: [react()],
  test: { environment: "jsdom" } as any,
});
