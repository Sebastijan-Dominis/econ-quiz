import { createApp, markRaw } from 'vue';
import { createPinia } from 'pinia';
import '../src/assets/index.css';
import App from './App.vue';
import router from './router';
import { firebaseApp } from './js/firebase';

const pinia = createPinia();

pinia.use(({ store }) => {
    store.router = markRaw(router);
})

createApp(App)
    .use(pinia)
    .use(router, {
        firebaseApp,
    })
    .mount('#app');
