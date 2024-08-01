<template>
    <div>
        <div class="" v-if="loading">
            <Spinner />
        </div>
        <div v-else class="overflow-x-auto text-black">
            <table class="table-auto border-collapse border border-slate-500 p-2">
                <thead>
                    <tr>
                        <th class="border border-slate-500"></th>
                        <th class="border border-slate-600 px-2 w-44">Bet</th>
                        <th class="border border-slate-600 px-2">Stakeperline</th>
                        <th class="border border-slate-600 px-2">Lines</th>
                        <th class="border border-slate-600 px-2">Amount</th>
                        <th class="border border-slate-600 px-2">Won Amount</th>
                        <th class="border border-slate-600 px-2">Nap</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, key) in betslips">
                        <th class="border border-slate-600 px-2">{{ key }}</th>
                        <td class="border border-slate-600 px-2 py-1"> {{ convertArray(item.bet1) }}</td>
                        <td class="border border-slate-600 px-2 py-1"> {{ convertNumber(item.stakePerLine) }}</td>
                        <td class="border border-slate-600 px-2 py-1"> {{ item.lines }}</td>
                        <td class="border border-slate-600 px-2 py-1"> {{ convertNumber(item.amount) }}</td>
                        <td class="border border-slate-600 px-2 py-1 "> {{ convertNumber(item.wonAmount) }} </td>
                        <td class="border border-slate-600 px-2 py-1"> {{ item.betType?.name }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import Spinner from '@/components/Spinner.vue';
import { convertNumber } from '@/services/convertNumber.js';
import { convertArray } from '@/services/convertArray.js';


const props = defineProps({
    betslips: Array,
    loading: Boolean
});

</script>

<style lang="scss" scoped></style>