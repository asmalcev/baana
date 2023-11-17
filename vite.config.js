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
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    esbuild: {
        loader: 'tsx',
    },
    plugins: [
        react({
            babel: {
                plugins: [
                    '@babel/plugin-transform-optional-chaining',
                    '@babel/plugin-transform-nullish-coalescing-operator',
                ],
            },
        }),
        dts({ include: ['lib'], exclude: ['src'] }),
        libInjectCss(),
    ],
});
