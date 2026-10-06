import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

/** What the sign-in response carries about the agent; the API decides the exact fields */
export type AgentUser = Record<string, any>;

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        user: useLocalStorage<AgentUser>('vueUseUser', {}),
        token: useLocalStorage<string | null>('vueUseToken', null)
    }),

    getters: {
        isLoggedIn: (state) => {
            return state.token != null ? true : false
        }
    }
});
