import { createApp } from 'vue';

import App from './App.vue';
import AppIcon from './components/AppIcon.vue';

import './main.css';
import './models';

const app = createApp(App);

app.component('AppIcon', AppIcon);
app.mount('#app');
