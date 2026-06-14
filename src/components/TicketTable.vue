<template>
    <div>
        <div class="flex justify-center p-8" v-if="loading">
            <Spinner />
        </div>
        <div v-else class="w-full">
            <!-- Mobile Card View -->
            <div class="md:hidden flex flex-col gap-4">
                <div v-for="(item, key) in betslips" :key="'mob-'+key" class="bg-white/80 dark:bg-navy-800/80 backdrop-blur-md rounded-2xl p-4 border border-brand-100/50 dark:border-navy-700 shadow-sm relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                    <div class="flex justify-between items-center border-b border-gray-100 dark:border-navy-700 pb-3 mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-navy-400">#{{ key + 1 }}</span>
                            <span class="bg-gray-100 dark:bg-navy-900 text-navy-500 dark:text-navy-300 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
                                {{ item.betType?.name || 'N/A' }}
                            </span>
                            <span v-if="item.winningType === 2" class="bg-brand-50 text-brand-500 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">Machine</span>
                            <span v-else class="bg-gray-100 dark:bg-navy-900 text-navy-500 dark:text-navy-300 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">Normal</span>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">Bet Numbers</p>
                        <div class="flex flex-wrap gap-1.5">
                            <span v-for="(num, nIdx) in parseBetNumbers(item.bet1)" :key="nIdx" 
                                  class="size-8 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-bold flex items-center justify-center shadow-sm border border-brand-100 dark:border-brand-500/20">
                                {{ num }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 gap-3 text-sm">
                        <div class="bg-gray-50 dark:bg-navy-900 rounded-xl p-2.5 flex flex-col justify-center">
                            <p class="text-[10px] font-bold text-navy-400 uppercase tracking-widest">Amount</p>
                            <p class="font-bold text-navy-700 dark:text-white mt-0.5">₦ {{ convertNumber(item.amount) }}</p>
                            <p class="text-[10px] text-navy-400 mt-0.5">{{ item.lines }} lines × ₦{{ convertNumber(item.stakePerLine) }}</p>
                        </div>
                    </div>
                </div>
                
                <div v-if="!betslips || betslips.length === 0" class="text-center py-8 text-navy-400 font-medium bg-white/50 dark:bg-navy-800/50 rounded-2xl">
                    <div class="flex justify-center mb-2 text-navy-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    No bet slips found.
                </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden md:block overflow-x-auto rounded-3xl border border-brand-100/50 dark:border-navy-700 bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl shadow-lg shadow-brand-500/5">
                <table class="w-full text-left text-sm text-navy-700 dark:text-navy-200">
                    <thead class="bg-gray-50/80 dark:bg-navy-900/80 backdrop-blur-md text-xs uppercase text-navy-400 font-bold border-b border-brand-100/50 dark:border-navy-700">
                        <tr>
                            <th class="px-4 py-4 whitespace-nowrap text-center w-12">#</th>
                            <th class="px-4 py-4 min-w-[200px]">Bet Numbers</th>
                            <th class="px-4 py-4 whitespace-nowrap">Nap</th>
                            <th class="px-4 py-4 whitespace-nowrap">Type</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Lines</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Stake/Line</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100/80 dark:divide-navy-700">
                        <tr v-for="(item, key) in betslips" :key="key" class="hover:bg-brand-50/50 dark:hover:bg-navy-900/80 transition-colors group">
                            <td class="px-4 py-4 text-center font-bold text-navy-400 group-hover:text-brand-500 transition-colors">{{ key + 1 }}</td>
                            <td class="px-4 py-4">
                                <!-- Split balls into bubbles for accumulator support -->
                                <div class="flex flex-wrap gap-1.5">
                                    <span v-for="(num, nIdx) in parseBetNumbers(item.bet1)" :key="nIdx" 
                                          class="size-8 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-bold flex items-center justify-center shadow-sm border border-brand-100 dark:border-brand-500/20 group-hover:scale-110 group-hover:shadow-brand-500/20 transition-all">
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
                        </tr>
                    </tbody>
                </table>
                <div v-if="!betslips || betslips.length === 0" class="text-center py-10 text-navy-400 font-medium bg-white/50 dark:bg-navy-800/50">
                    <div class="flex justify-center mb-3 text-navy-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
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