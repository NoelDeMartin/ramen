import i18n from '@aerogel/plugin-i18n';
import solid from '@aerogel/plugin-solid';
import soukai from '@aerogel/plugin-soukai';
import { bootstrapApplication } from '@aerogel/core';

import './assets/styles.css';
import App from './App.vue';
import { services } from './services';

bootstrapApplication(App, {
    services,
    plugins: [
        i18n({ messages: import.meta.glob('@/lang/*.yaml') }),
        soukai({ models: import.meta.glob('@/models/*', { eager: true }) }),
        solid(),
    ],
});
