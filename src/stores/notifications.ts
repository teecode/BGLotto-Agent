import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useNotificationStore = defineStore('notificationStore', () => {
    const unreadCount = ref(0);

    const fetchUnreadCount = async (shopId: number = 0) => {
        try {
            const res = await axios.get(`Notification/ShopNotifications/UnreadCount?shopId=${shopId}`);
            unreadCount.value = res.data?.count ?? 0;
        } catch {
            // silently fail
        }
    };

    const decrement = (by = 1) => {
        unreadCount.value = Math.max(0, unreadCount.value - by);
    };

    const reset = () => {
        unreadCount.value = 0;
    };

    return { unreadCount, fetchUnreadCount, decrement, reset };
});
