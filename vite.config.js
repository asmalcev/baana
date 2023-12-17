import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from "@vitejs/plugin-react-swc";
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/index.ts'),
            name: 'baana-react',
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
        react(),
        dts({ include: ['lib'], exclude: ['src'] }),
        libInjectCss(),
    ],
});
