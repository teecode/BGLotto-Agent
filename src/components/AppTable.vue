<template>
    <div class="w-full">
        <!-- Table Loader -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700">
            <Spinner class="size-12 text-brand-500" />
            <p class="mt-4 text-navy-400 font-medium animate-pulse">Fetching records...</p>
        </div>

        <div v-else class="space-y-4">
            <!-- Table Action Header -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2">
                <div class="flex-1">
                    <p class="text-navy-700 dark:text-white text-lg font-bold">
                        <slot name="tableheadertext"></slot>
                    </p>
                </div>
                
                <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <!-- Search Input -->
                    <div v-if="search" class="relative flex-1 md:flex-none min-w-[200px]">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-navy-400">
                            <Search class="size-4" />
                        </div>
                        <input 
                            v-model="query"
                            @keyup.enter="submitSearch"
                            type="text" 
                            placeholder="Search records..."
                            class="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-navy-900 border-none rounded-xl text-sm text-navy-700 dark:text-white placeholder:text-navy-300 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                        >
                    </div>

                    <!-- Date Picker -->
                    <div v-if="dateFilter" class="flex-1 md:flex-none">
                        <date-picker 
                            v-model:value="date" 
                            :type="dateFilterRange ? 'date' : 'date'" 
                            :range="dateFilterRange"
                            placeholder="Select date range" 
                            value-type="format" 
                            format="YYYY-MM-DD"
                            @change="updateDateFilter"
                            class="custom-datepicker"
                        ></date-picker>
                    </div>
                    
                    <slot name="dropdown"></slot>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="!fields || fields.length === 0" class="flex flex-col items-center justify-center py-20 bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700 text-center px-6">
                <div class="size-16 bg-brand-50 dark:bg-navy-700 rounded-2xl flex items-center justify-center mb-4 text-brand-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                </div>
                <h3 class="text-lg font-bold text-navy-700 dark:text-white">No records found</h3>
                <p class="text-navy-400 mt-1 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>

            <!-- Desktop Table View -->
            <div v-else class="hidden md:block overflow-hidden bg-white dark:bg-navy-800 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50/50 dark:bg-navy-900/50">
                                <th v-for="item in header" :key="item.key" class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-navy-400 border-b border-gray-100 dark:border-navy-700">
                                    <slot v-if="slots[`header-${item.key}`]" :name="`header-${item.key}`" v-bind="item" />
                                    <span v-else>{{ item.label }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 dark:divide-navy-700">
                            <tr v-for="(item, index) in fields" :key="index" 
                                @click="$emit('rowClicked', item)"
                                class="group hover:bg-brand-50/30 dark:hover:bg-navy-900/30 transition-colors cursor-pointer">
                                <td v-for="headerItem in header" :key="headerItem.key" class="px-6 py-4 text-sm text-navy-700 dark:text-navy-200">
                                    <slot v-if="slots[`item-${headerItem.key}`]" :name="`item-${headerItem.key}`" v-bind="item" />
                                    <span v-else class="font-medium">{{ item[headerItem.key] }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Mobile Card View -->
            <div v-if="fields && fields.length > 0" class="md:hidden space-y-4">
                <div v-for="(item, index) in fields" :key="index" 
                     @click="$emit('rowClicked', item)"
                     class="bg-white dark:bg-navy-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-700 active:scale-[0.98] transition-all">
                    <div class="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div v-for="headerItem in header" :key="headerItem.key" class="space-y-1">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-navy-300">{{ headerItem.label }}</p>
                            <div class="text-sm font-bold text-navy-700 dark:text-white truncate">
                                <slot v-if="slots[`item-${headerItem.key}`]" :name="`item-${headerItem.key}`" v-bind="item" />
                                <span v-else>{{ item[headerItem.key] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="paginated && fields && fields.length > 0" 
                 class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-700">
                <p class="text-sm text-navy-400 font-medium whitespace-nowrap">
                    Showing <span class="text-navy-700 dark:text-white font-bold">{{ pageRangeStart }}</span> to <span class="text-navy-700 dark:text-white font-bold">{{ pageRangeEnd }}</span> of <span class="text-navy-700 dark:text-white font-bold">{{ totalRecords }}</span>
                </p>
                
                <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    <button 
                        @click="prevPage" 
                        :disabled="page === 1"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-navy-700 dark:text-white"
                    >
                        <LeftIcon class="size-5" />
                    </button>
                    
                    <div class="flex items-center gap-1">
                        <template v-for="n in totalPages" :key="n">
                            <button 
                                v-if="Math.abs(n - page) < 3 || n === 1 || n === totalPages"
                                @click="updatePage(n)"
                                :class="[
                                    n === page 
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
                                    : 'bg-gray-50 dark:bg-navy-900 text-navy-400 hover:bg-brand-50 dark:hover:bg-navy-700'
                                ]"
                                class="size-8 rounded-lg text-xs font-bold transition-all"
                            >
                                {{ n }}
                            </button>
                            <span v-else-if="Math.abs(n - page) === 3" class="text-navy-300 px-1">...</span>
                        </template>
                    </div>

                    <button 
                        @click="nextPage" 
                        :disabled="page === totalPages"
                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-navy-700 dark:text-white"
                    >
                        <RightIcon class="size-5" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Spinner from './Spinner.vue';
import Search from '../assets/svg/SearchIcon.vue';
import { ref, useSlots , computed } from 'vue';
import LeftIcon from '@/assets/svg/LeftIcon.vue';
import RightIcon from '@/assets/svg/RightIcon.vue';
import DatePicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

const slots = useSlots();
const props = defineProps({
    header: Array,
    fields: Array,
    loading: Boolean,
    totalPages: Number,
    totalRecords: Number,
    dataCount: Number,
    empty: Boolean,
    paginated: Boolean,
    search: Boolean,
    dateFilter: Boolean,
    dateFilterRange: Boolean,
    pageSize: Number
});

const emit = defineEmits([
    'rowClicked',
    'pageChange',
    'pageSizeChange',
    'dateUpdated',
    'searchQuery'
]);

let page = ref(1);
let date = ref();
let query = ref("");

const pageRangeEnd = computed(() => {
    return Math.min((props.pageSize * (page.value - 1)) + (props.fields?.length || 0), props.totalRecords || 0)
});

const pageRangeStart = computed(() => {
    return (props.pageSize * (page.value - 1)) + 1;
});

const prevPage = () => {
    if (page.value > 1) {
        page.value -= 1;
        emit('pageChange', page.value)
    }
};

const nextPage = () => {
    if (page.value < props.totalPages) {
        page.value += 1;
        emit('pageChange', page.value)
    }
};

const updatePage = (item) => {
    page.value = item;
    emit('pageChange', item);
}

const updateDateFilter = () => {
    emit('dateUpdated', date.value);
};

const submitSearch = () => {
    emit('searchQuery', query.value);
};
</script>

<style>
.custom-datepicker .mx-input {
    @apply !bg-gray-50 !dark:bg-navy-900 !border-none !rounded-xl !h-10 !text-sm !text-navy-700 !dark:text-white !placeholder-navy-300 !shadow-none !px-4;
}
.custom-datepicker .mx-icon-calendar, 
.custom-datepicker .mx-icon-clear {
    @apply !text-navy-400;
}
</style>
</style>