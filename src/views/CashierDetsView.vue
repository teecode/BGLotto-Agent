<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Cashier Details</h2>
        </div>
        <div class="px-10 py-5 space-y-3">
            <AppTable :header="cashierTableHeader" :fields="cashierDets" :loading="loading" :paginated="true"
                @pageChange="updatePage" :totalPages="totalPages" :pageSize="pageSize" :totalRecords="totalData"
                :dataCount="cashierDets.length" >

                <template #item-action="item">
                    <div>
                        <button class="py-2 px-3 ">Block Cashier</button>
                    </div>
                </template>
            </AppTable>
        </div>

    </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import  logOut from '../services/logout';
import AppTable from '@/components/AppTable.vue';
const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

// let user = reactive({}) as Record<string, any>;

// const user:Ref<User | string >  = ref("");
    
let cashierDets = reactive([]);

const userId = ref(Number(authStore.user.shopId));

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
        label: "Action",
        key: "action"
    }
]);

let loading = ref(false);
let totalData = ref(null);
let totalPages = ref(0);
let pageSize = ref(10);

const fetchCasheirs = async () => {
    try {
        loading.value = true;
        const res = await axios.get(`Retail/cashiers?ShopId=${userId.value}`);
        console.log(res.data)
        cashierDets = res.data.data;
        totalData.value = res.data.totalCount;
        totalPages.value = res.data.totalPages;
        loading.value = false;
    } catch (err) {
        console.log(err)
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

onMounted(() => {
    fetchCasheirs();
});



</script>

<style scoped>
</style>