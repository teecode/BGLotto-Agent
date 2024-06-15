import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: useLocalStorage('vueUseUser', {}),
        token: useLocalStorage('vueUseToken', null)
    }),

    getters: {
        isLoggedIn: (state) => {
            return state.token != null ? true : false
        }
    }
});