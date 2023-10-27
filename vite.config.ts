import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'lib/index.ts'),
            name: 'baana-react',
            // the proper extensions will be added
            fileName: 'baana-react',
        },
    },
    esbuild: {
        loader: "tsx"
    },
    plugins: [react()],
});
