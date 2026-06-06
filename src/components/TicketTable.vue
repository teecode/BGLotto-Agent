<template>
    <div>
        <div class="flex justify-center p-8" v-if="loading">
            <Spinner />
        </div>
        <div v-else class="w-full">
            <div class="overflow-x-auto rounded-2xl border border-gray-100 dark:border-navy-700">
                <table class="w-full text-left text-sm text-navy-700 dark:text-navy-200">
                    <thead class="bg-gray-50 dark:bg-navy-900/50 text-xs uppercase text-navy-400 font-bold border-b border-gray-100 dark:border-navy-700">
                        <tr>
                            <th class="px-4 py-4 whitespace-nowrap text-center w-12">#</th>
                            <th class="px-4 py-4 min-w-[200px]">Bet Numbers</th>
                            <th class="px-4 py-4 whitespace-nowrap">Nap</th>
                            <th class="px-4 py-4 whitespace-nowrap">Type</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Lines</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Stake/Line</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Amount</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Won Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-navy-700 bg-white dark:bg-navy-800">
                        <tr v-for="(item, key) in betslips" :key="key" class="hover:bg-gray-50 dark:hover:bg-navy-900/50 transition-colors">
                            <td class="px-4 py-4 text-center font-bold text-navy-400">{{ key + 1 }}</td>
                            <td class="px-4 py-4">
                                <!-- Split balls into bubbles for accumulator support -->
                                <div class="flex flex-wrap gap-1.5">
                                    <span v-for="(num, nIdx) in parseBetNumbers(item.bet1)" :key="nIdx" 
                                          class="size-8 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-bold flex items-center justify-center shadow-sm border border-brand-100 dark:border-brand-500/20">
                                        {{ num }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-4 py-4 font-bold">
                                <span class="bg-gray-100 dark:bg-navy-900 text-navy-500 dark:text-navy-300 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                                    {{ item.betType?.name || 'N/A' }}
                                </span>
                            </td>
                            <td class="px-4 py-4 font-bold">
                                <span v-if="item.winningType === 2" class="bg-brand-50 text-brand-500 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Machine</span>
                                <span v-else class="bg-gray-100 dark:bg-navy-900 text-navy-500 dark:text-navy-300 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">Normal</span>
                            </td>
                            <td class="px-4 py-4 text-right font-medium">{{ item.lines }}</td>
                            <td class="px-4 py-4 text-right font-medium">₦ {{ convertNumber(item.stakePerLine) }}</td>
                            <td class="px-4 py-4 text-right font-bold text-navy-700 dark:text-white">₦ {{ convertNumber(item.amount) }}</td>
                            <td class="px-4 py-4 text-right font-bold">
                                <span :class="item.wonAmount > 0 ? 'text-green-500' : 'text-navy-300'">
                                    ₦ {{ convertNumber(item.wonAmount) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="!betslips || betslips.length === 0" class="text-center py-8 text-navy-400 font-medium bg-white dark:bg-navy-800">
                    No bet slips found for this ticket.
                </div>
            </div>
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

const parseBetNumbers = (betStr) => {
    if (!betStr) return [];
    // Use convertArray to strip brackets, then split by comma
    const raw = convertArray(betStr);
    return raw.split(',').map(s => s.trim()).filter(s => s !== '');
};
</script>

<style scoped></style>