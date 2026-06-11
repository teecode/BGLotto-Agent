<template>
  <div class="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header Card -->
    <header class="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="text-2xl font-bold text-navy-700 dark:text-white">Cashier Management</h2>
        <p class="text-navy-400 font-medium mt-1">View and manage your shop's cashiers</p>
      </div>
    </header>

    <!-- Content Card -->
    <div class="bg-white dark:bg-navy-800 rounded-3xl p-4 lg:p-6 shadow-sm border border-gray-100 dark:border-navy-700 w-full overflow-hidden">
        <AppTable :header="cashierTableHeader" :fields="cashierDets" :loading="loading" :paginated="true"
            @pageChange="updatePage" :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
            :dataCount="cashierDets.length" :empty="error">

            <template #item-action="item">
                <div class="flex gap-2">
                    <button v-if="isPrincipalAgent" @click="editCashier(item)"
                        class="px-4 py-2 bg-brand-50 hover:bg-brand-100 dark:bg-navy-900 dark:hover:bg-navy-700 text-brand-500 font-bold rounded-xl text-xs transition-all active:scale-[0.95]">
                        Edit Cashier
                    </button>
                    <button v-if="isPrincipalAgent || item.id === loggedInUserId"
                        @click="openPasswordModal(item)"
                        class="px-4 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-navy-900 dark:hover:bg-navy-700 text-orange-500 font-bold rounded-xl text-xs transition-all active:scale-[0.95]">
                        Change Password
                    </button>
                </div>
            </template>
        </AppTable>
    </div>

    <!-- Edit Cashier Modal -->
    <Modal :show="showModal" @close="closeModal">
        <template v-slot:title>
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-0.5">Edit Cashier</p>
                    <h5 class="text-xl font-bold text-navy-700 dark:text-white leading-tight">{{ editCashDets.firstname }} {{ editCashDets.lastname }}</h5>
                </div>
                <button @click="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-navy-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </template>

        <template v-slot:description>
            <div class="mt-5 space-y-5">
                <!-- Name fields -->
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-semibold text-navy-400 uppercase tracking-widest mb-1.5">First Name</label>
                        <input type="text" v-model="editCashDets.firstname" placeholder="First name"
                            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-xl text-sm text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-navy-400 uppercase tracking-widest mb-1.5">Last Name</label>
                        <input type="text" v-model="editCashDets.lastname" placeholder="Last name"
                            class="w-full px-3 py-2.5 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-xl text-sm text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none">
                    </div>
                </div>

                <!-- Permissions -->
                <div class="bg-gray-50 dark:bg-navy-900 rounded-2xl border border-gray-100 dark:border-navy-700 divide-y divide-gray-100 dark:divide-navy-700 overflow-hidden">
                    <label class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                        <span class="text-sm font-medium text-navy-700 dark:text-navy-200">Active Status</span>
                        <input type="checkbox" v-model="editCashDets.isActive" class="w-4.5 h-4.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer">
                    </label>
                    <label class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                        <span class="text-sm font-medium text-navy-700 dark:text-navy-200">Can Delete Ticket</span>
                        <input type="checkbox" v-model="editCashDets.canDelete" class="w-4.5 h-4.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer">
                    </label>
                    <label class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                        <span class="text-sm font-medium text-navy-700 dark:text-navy-200">Can Cashout</span>
                        <input type="checkbox" v-model="editCashDets.canCashout" class="w-4.5 h-4.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer">
                    </label>
                    <label class="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                        <span class="text-sm font-medium text-navy-700 dark:text-navy-200">Can Place Bet</span>
                        <input type="checkbox" v-model="editCashDets.canPlaceBet" class="w-4.5 h-4.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer">
                    </label>
                </div>

                <!-- Stake limit -->
                <div>
                    <label class="block text-xs font-semibold text-navy-400 uppercase tracking-widest mb-1.5">Stake Limit (₦)</label>
                    <input type="number" v-model="editCashDets.maxStakeLimit"
                        class="w-full px-4 py-3 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-bold text-lg">
                </div>
            </div>
        </template>

        <template v-slot:buttons>
            <div class="mt-6 flex gap-3 w-full">
                <button class="flex-1 py-3 text-sm font-bold text-navy-700 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-navy-900 dark:hover:bg-navy-700 rounded-xl transition-all"
                    @click="closeModal">
                    Cancel
                </button>
                <button @click="updateCashier"
                    class="flex-1 py-3 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-all shadow-lg shadow-brand-500/30">
                    Save Changes
                </button>
            </div>
        </template>
    </Modal>

    <!-- Change Password Modal -->
    <Modal :show="showPasswordModal" @close="closePasswordModal">
        <template v-slot:title>
            <div class="flex items-center justify-between">
                <h5 class="text-xl font-bold text-navy-700 dark:text-white">Change Password</h5>
                <button @click="closePasswordModal" class="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-full transition-colors text-navy-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </template>

        <template v-slot:description>
            <div class="mt-6 space-y-4">
                <div class="p-4 bg-gray-50 dark:bg-navy-900 rounded-2xl mb-6 border border-gray-100 dark:border-navy-700">
                    <p class="text-xs text-navy-400 uppercase tracking-widest font-bold">Cashier Name</p>
                    <p class="text-lg font-bold text-navy-700 dark:text-white mt-1">{{ passwordCashier.firstname }} {{ passwordCashier.lastname }}</p>
                </div>

                <div class="space-y-4 px-1">
                    <div>
                        <label class="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">New Password</label>
                        <input
                            type="password"
                            v-model="newPassword"
                            placeholder="Enter new password"
                            class="w-full px-4 py-3 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                        >
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-navy-700 dark:text-navy-200 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            v-model="confirmPassword"
                            placeholder="Confirm new password"
                            class="w-full px-4 py-3 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-600 rounded-xl text-navy-700 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                        >
                    </div>

                    <p v-if="passwordError" class="text-sm font-medium text-red-500 pt-1">{{ passwordError }}</p>
                </div>
            </div>
        </template>

        <template v-slot:buttons>
            <div class="mt-8 flex gap-3 w-full">
                <button class="flex-1 py-3 text-sm font-bold text-navy-700 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-navy-900 dark:hover:bg-navy-700 rounded-xl transition-all"
                    @click="closePasswordModal">
                    Cancel
                </button>
                <button @click="updateCashierPassword" :disabled="passwordLoading"
                    class="flex-1 py-3 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 rounded-xl transition-all shadow-lg shadow-brand-500/30">
                    {{ passwordLoading ? 'Updating...' : 'Update Password' }}
                </button>
            </div>
        </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import logOut from '../services/logout';
import AppTable from '@/components/AppTable.vue';
import Modal from '@/components/Modal.vue'

const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

let cashierDets = reactive([]);

const userId = ref(Number(authStore.user.shopId));

// customerType 1002 = PrincipalAgent, 2 = SubAgent/MobileSubAgent
const isPrincipalAgent = computed(() => authStore.user.customerType === 1002);
const loggedInUserId = authStore.user.customerId;

let cashierTableHeader = reactive([
    {
        label: "FirstName",
        key: "firstname"
    },
    {
        label: "LastName",
        key: "firstname"
    },
    {
        label: "ShopName",
        key: "shopName"
    },
    {
        label: "Phone Number",
        key: "phonenumber"
    },
    {
        label: "Actions",
        key: "action"
    }
]);

let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);
let showModal = ref(false);
let editCashDets = reactive({});
let error = ref(false);

// Password modal state
let showPasswordModal = ref(false);
let passwordCashier = reactive({});
let newPassword = ref('');
let confirmPassword = ref('');
let passwordError = ref('');
let passwordLoading = ref(false);

const fetchCasheirs = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`);
        cashierDets = res.data.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        loading.value = false;
        if (cashierDets.length == 0) {
            error.value = true
        }
    } catch (err) {
        if (err?.response?.status == 401) {
            console.log(`this ran`)
            logOut()
        }
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

const updatePage = (pageNumber) => {
    currentPage.value = pageNumber;
};

const editCashier = (item) => {
    showModal.value = !showModal.value;
    editCashDets = item;
};

const closeModal = () => {
    showModal.value = !showModal.value;
    editCashDets = {};
}

const updateCashier = async () => {
    try {
        const res = await axios.post(`Retail/agent-cashier-update`, {
            id: editCashDets.id,
            firstname: editCashDets.firstname,
            lastname: editCashDets.lastname,
            isActive: editCashDets.isActive,
            canDeleteTicket: editCashDets.canDelete,
            canCashout: editCashDets.canCashout,
            canPlaceBet: editCashDets.canPlaceBet,
            maxStakeLimit: editCashDets.maxStakeLimit
        });
        if(res.status == 200){
            closeModal();
            snackbar.add({
            type: 'success',
            text: `Cashier successfully updated`
        });
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        });
    }
};

const openPasswordModal = (item) => {
    passwordCashier = item;
    showPasswordModal.value = true;
};

const closePasswordModal = () => {
    showPasswordModal.value = false;
    passwordCashier = {};
    newPassword.value = '';
    confirmPassword.value = '';
    passwordError.value = '';
};

const updateCashierPassword = async () => {
    passwordError.value = '';

    if (!newPassword.value) {
        passwordError.value = 'New password is required.';
        return;
    }
    if (newPassword.value.length < 6) {
        passwordError.value = 'Password must be at least 6 characters.';
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'Passwords do not match.';
        return;
    }

    try {
        passwordLoading.value = true;
        const res = await axios.put('Retail/cashier-password', {
            cashierId: passwordCashier.id,
            newPassword: newPassword.value
        });
        if (res.status === 200) {
            closePasswordModal();
            snackbar.add({
                type: 'success',
                text: 'Password updated successfully.'
            });
        }
    } catch (err) {
        passwordError.value = err?.response?.data?.message || `Failed to update password: ${err.message}`;
    } finally {
        passwordLoading.value = false;
    }
};

onMounted(() => {
    fetchCasheirs();
});
</script>

<style scoped></style>
