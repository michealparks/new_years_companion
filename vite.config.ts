import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import vitePluginString from 'vite-plugin-string'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    vitePluginString.default(),
    mix.default({ handler: './api.ts' }),
  ]
})
