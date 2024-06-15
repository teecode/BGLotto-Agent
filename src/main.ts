import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";

import './assets/main.css'
import axios from 'axios';

import App from './App.vue';
import router from './router';

// SERVER BASE URL
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

axios.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem('vueUseToken')}`,
    //'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json'
  }
  // return config to not block request
  return config
});

const app = createApp(App);

app.use(SnackbarService);

app.use(createPinia());
app.use(router);

app.mount('#app');
