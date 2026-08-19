import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true as const,
      // ALWAYS keep HMR + file watching enabled.
      //
      // Previously, when the DISABLE_HMR env var was set (as AI Studio does
      // during agent edits), `watch: null` disabled Vite's file watching
      // entirely. The dev server then kept serving a stale, cached copy of
      // the code: edits never appeared in the preview, not even after a
      // manual refresh, until a full server restart.
      //
      // With watching + HMR always on, every saved edit is picked up
      // instantly and hot-reloaded into the page.
      hmr: true,
      watch: {
        // Poll for changes so edits are reliably detected in cloud/container
        // filesystems where native inotify events can be missed.
        usePolling: true,
        interval: 300,
      },
    },
  };
});
