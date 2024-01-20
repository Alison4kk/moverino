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
import Toolbar from 'primevue/toolbar';
import Sidebar from 'primevue/sidebar';
import Panel from 'primevue/panel';
import FileUpload from 'primevue/fileupload';
import InlineMessage from 'primevue/inlinemessage';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

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
app.component('InputSwitch', InputSwitch);
app.component('Toolbar', Toolbar);
app.component('Sidebar', Sidebar);
app.component('Panel', Panel);
app.component('FileUpload', FileUpload);
app.component('InlineMessage', InlineMessage);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);

app.mount('#app');
