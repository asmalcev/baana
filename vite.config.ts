import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'lib/index.ts'),
            name: 'baana-react',
            // the proper extensions will be added
            fileName: 'baana-react',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['react', 'react/jsx-runtime'],
        },
    },
    esbuild: {
        loader: 'tsx',
    },
    plugins: [
        react(),
        dts({ include: ['lib'], exclude: ['src'] }),
        libInjectCss(),
    ],
});
