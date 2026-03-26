import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/mocks/setup.ts"],
    css: true,
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/mocks/**",
        "src/**/*.d.ts",
        "src/**/*.types.ts",
        "src/types/**",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/app/api/**",
      ],
      thresholds: {
        statements: 99,
        functions: 100,
        lines: 99,
        branches: 95,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
