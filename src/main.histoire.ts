import '@aerogel/histoire/dist/styles.css';
import { defineSetupAerogel } from '@aerogel/histoire';

import { components } from './components';

import './assets/css/styles.css';

export const setupVue3 = defineSetupAerogel({
    components,
    messages: import.meta.glob('@/lang/*.yaml'),
});
