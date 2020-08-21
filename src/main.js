import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import 'normalize.css';
import 'animate.css';

const i18n = createI18n({
  locale: 'en'
});

createApp(App)
  .use(i18n)
  .mount('#app');
