import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";

import './assets/main.css'
import axios from 'axios';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { clearSession, isTokenExpired } from './services/session';

// SERVER BASE URL
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('vueUseToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers.Accept = 'application/json'
  // return config to not block request
  return config
});

// When a request is refused because the session has run out, go back to
// sign-in and remember the page. The API also answers 401 for some business
// rules while the token is still good, so the token's own expiry decides.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const auth = useAuthStore()
      const current = router.currentRoute.value
      if (auth.isLoggedIn && isTokenExpired(auth.token) && current.matched.some((record) => record.meta.requiresAuth)) {
        clearSession()
        router.replace({ name: 'Home', query: { redirect: current.fullPath, reason: 'expired' } })
      }
    }
    return Promise.reject(error)
  }
);

const app = createApp(App);

app.use(SnackbarService);

app.use(createPinia());
app.use(router);

app.mount('#app');
