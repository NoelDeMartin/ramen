import { URL, fileURLToPath } from 'node:url';

import Aerogel, { AerogelResolver } from '@aerogel/vite';
import Components from 'unplugin-vue-components/vite';
import I18n from '@intlify/unplugin-vue-i18n/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { defineConfig } from 'vitest/config';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export default defineConfig({
    build: { sourcemap: true },
    publicDir: fileURLToPath(new URL('./src/assets/public/', import.meta.url)),
    plugins: [
        Aerogel({
            name: 'Ramen',
            description: 'Can you make Ramen? Let\'s find out!',
            baseUrl: process.env.VITE_BASE_URL ?? 'https://ramen.noeldemartin.com',
            themeColor: '#da532c',
            icons: {
                '192x192': 'android-chrome-192x192.png',
                '512x512': 'android-chrome-512x512.png',
            },
        }),
        Components({
            deep: true,
            dts: 'src/types/components.d.ts',
            dirs: ['src/components'],
            resolvers: [AerogelResolver(), IconsResolver({ customCollections: ['app'] })],
        }),
        I18n({ include: fileURLToPath(new URL('./src/lang/**/*.yaml', import.meta.url)) }),
        Icons({
            iconCustomizer(_, __, props) {
                props['aria-hidden'] = 'true';
            },
            customCollections: {
                app: FileSystemIconLoader('./src/assets/icons'),
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    test: {
        environment: 'jsdom',
    },
});
