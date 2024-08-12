<template>
    <section class="bg-white dark:bg-[#111C44] rounded-2xl">
        <div class="flex items-center justify-between border-b border-[#2B2B40] px-10 py-5">
            <h2 class="text-base lg:text-2xl font-semibold">Cashout</h2>
        </div>
        <div class="px-3 lg:px-10 py-2 lg:py-5 space-y-3">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-8">
                <div class="flex flex-col">
                    <label>Customer ID</label>
                    <input type="text" class="border rounded-md p-1.5" v-model="form.customerId" />
                </div>
                <div class="flex flex-col">
                    <label>Ticket ID</label>
                    <input type="text" class="border rounded-md p-1.5" v-model="form.ticketId" />
                </div>
                <div class="flex flex-col">
                    <label>Terminal ID</label>
                    <input type="text" class="border rounded-md p-1.5" v-model="form.terminalId" />
                </div>
                <div class="flex flex-col pt-2">
                    <button @click="checkTicketStatus"
                        class="bg-blue-800 dark:bg-[#7551FF] text-white py-3 px-2 rounded-md">Check
                        Ticket</button>
                </div>
            </div>
        </div>

        <Modal :show="showModal">


            <template v-slot:title>
                <h5 class="text-[#565674] text-lg">Confirm Ticket</h5>
            </template>

            <template v-slot:description>
                <div>
                    <div class="flex flex-col">
                        <label>Customer ID</label>
                        <input type="text" class="border rounded-md p-1.5" v-model="form.customerId" />
                    </div>
                    <div class="flex flex-col">
                        <label>Ticket ID</label>
                        <input type="text" class="border rounded-md p-1.5" v-model="form.ticketId" />
                    </div>
                    <div class="flex flex-col">
                        <label>Terminal ID</label>
                        <input type="text" class="border rounded-md p-1.5" v-model="form.terminalId" />
                    </div>
                    <div class="flex flex-col">
                        <label>Payout Pin</label>
                        <input type="text" class="border rounded-md p-1.5" v-model="form.payoutPin" />
                    </div>
                </div>
            </template>

            <template v-slot:buttons>
                <div class="w-full flex gap-2 ">
                    <button @click="cashoutTicket"
                        class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-blue-800 dark:bg-[#7551FF]">Cashout
                        Ticket</button>
                    <button class="text-sm border px-6 py-2.5 font-medium text-white rounded-lg w-full bg-red-600"
                        @click="closeModal">
                        Cancel
                    </button>
                </div>
            </template>

        </Modal>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import axios from 'axios';
import { useSnackbar } from "vue3-snackbar";
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Spinner from '@/components/Spinner.vue';
import Modal from '@/components/Modal.vue';
import { format } from 'date-fns';

const snackbar = useSnackbar();
const authStore = useAuthStore();

let showModal = ref(false);

const form = reactive({
    customerId: "",
    ticketId: "",
    terminalId: "",
    payoutPin: ""
});


const checkTicketStatus = async () => {
    try {
        const res = await axios.post(`Ticket/cash-out-check`, {
            customerId: form.customerId,
            ticketId: form.ticketId,
            terminalId: form.terminalId
        })
        if (res.status == 200) {
            showModal.value = true;
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        })
    }
};



const cashoutTicket = async () => {
    try {
        const res = await axios.post(`Ticket/cash-out`, {
            customerId: form.customerId,
            ticketId: form.ticketId,
            terminalId: form.terminalId,
            payoutPin: form.payoutPin
        })
        if (res.status == 200) {
            snackbar.add({
                type: 'success',
                text: `Ticket successfully Cashout`
            })
            showModal.value = false;
        }
    } catch (err) {
        snackbar.add({
            type: 'error',
            text: `Please contact support ${err.message}`
        })
    }
};

const closeModal = () => {
    showModal.value = false;
}

</script>

<style scoped></style>