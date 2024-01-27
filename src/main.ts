import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import primevueLocale  from '@/assets/modules_config/primevue/locale-pt-br.json';
import LabeledInput from '@/components/utils/LabeledInput.vue';
import Mover from '@/components/utils/Mover.vue';
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
import SelectButton from 'primevue/selectbutton';
import ToggleButton from 'primevue/togglebutton';
import Divider from 'primevue/divider';
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset';
import InputNumber from 'primevue/inputnumber';

import './assets/main.css';


const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara,
  ripple: true,
  locale: primevueLocale['pt-br']
});


app.component('LabeledInput', LabeledInput);
app.component('Mover', Mover);

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
app.component('SelectButton', SelectButton);
app.component('ToggleButton', ToggleButton);
app.component('Divider', Divider);
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('Dialog', Dialog);
app.component('Fieldset', Fieldset);
app.component('InputNumber', InputNumber);
app.use(ToastService);

app.mount('#app');

export {app};