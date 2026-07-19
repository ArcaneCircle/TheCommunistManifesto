import { defineConfig } from "vite";
import { buildXDC, eruda, mockWebxdc } from "@webxdc/vite-plugins";

// https://vitejs.dev/config/
export default defineConfig({ plugins: [buildXDC(), eruda(), mockWebxdc()] });
