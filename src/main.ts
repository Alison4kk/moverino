import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css'
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';

// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"


const app = createApp(App);

app.use(router);
app.use(PrimeVue);

app.component('InputText', InputText);
app.component('Menubar', Menubar);

app.mount('#app');
