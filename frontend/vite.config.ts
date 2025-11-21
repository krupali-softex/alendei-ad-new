import path from 'path';

import { defineConfig } from 'vite'

import checker from 'vite-plugin-checker';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const PORT = 5173;

export default defineConfig({
  plugins: [react(),
    checker({
      // eslint: {
      //   lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      // },
      overlay: {
        position: 'tl',
        initialIsOpen: false,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: { port: PORT, host: true,allowedHosts: [
       "flexiads.alendei.io"
   // "83c3eb746201.ngrok-free.app"
  ] },
  preview: { port: PORT, host: true },
})
