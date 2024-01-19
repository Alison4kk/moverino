import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'


import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primeicons/primeicons.css'
import Menubar from 'primevue/menubar';
import Lara from '@/presets/lara';
import InputText from 'primevue/inputtext';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';

import './assets/main.css';

// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"


const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara                            //apply preset
});

app.component('InputText', InputText);
app.component('Menubar', Menubar);
app.component('Card', Card);
app.component('Button', Button)
app.component('InputSwitch', InputSwitch)

app.mount('#app');
