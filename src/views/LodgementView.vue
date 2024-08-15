<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Lodgement</h2>
        </div>
        <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
            <date-picker v-model:value="date" type="date" range placeholder="Select date range" value-type="format"
            format="YYYY-MM-DD" @change="updateDateFilter"></date-picker>
            <AppTable :header="cashierTableHeader" :fields="lodgement" :loading="loading2" 
               :empty="error">
               <template #item-date="{ date }">
                        {{ format(new Date(date), 'dd-MM-yyyy') }}
                    </template>
            </AppTable>
        </div>
        
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';
import Spinner from '@/components/Spinner.vue';
import AppTable from '@/components/AppTable.vue';
import { format } from 'date-fns';



const snackbar = useSnackbar();
const authStore = useAuthStore();
const router = useRouter();

let cashierDets = reactive([]);

const userId = ref(Number(authStore.user.shopId));

let date = ref();
let loading = ref(false);
let error = ref(false);
let loading2 = ref(false);
let cashierId = ref("");
let startDate = ref(format(new Date(), 'yyyy-MM-dd'));
let endDate = ref(format(new Date(), 'yyyy-MM-dd'));
const lodgement = ref([]);


let cashierTableHeader = reactive([
    {
        label : "Date",
        key: "date"
    },
    {
        label: "Amount",
        key: "amount"
    },
    {
        label: "Balance Before",
        key: "balanceBefore"
    },
    {
        label: "Balance After",
        key: "balanceAfter"
    },
    {
        label: "Bank",
        key: "bankName"
    }
])

const updateDateFilter = () => {
    startDate.value = date.value[0];
    endDate.value = date.value[1]; 
};

const fetchLodgement = async() => {
    try{
        loading2.value = true;
        const res = await axios.get(`RetailFinance/payment/search?page=1&pageSize=10&transactionDateFrom=${startDate.value}&transactionDateTo=${endDate.value}&shopCode=${authStore.user.shopCode}&transactionCategory=2008`);
        lodgement.value = res.data.data;
        if (lodgement.length == 0) {
            error.value = true
        }
        loading2.value = false; 
    } catch(err){
        console.log(err)
    }
}

onMounted(() => {
    fetchLodgement();
});

watchEffect(() => {
    fetchLodgement();
})


</script>

<style lang="scss" scoped>

</style>