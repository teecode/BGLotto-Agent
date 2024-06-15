<template>
    <div class="p-1">
        <div>
            <div class="p-2" v-if="loading">
                <Spinner />
            </div>
            <div v-else-if="empty">

            </div>
            <div v-else>
                <div class="flex items-center justify-between p-1">
                    <div>
                        <p class="text-[#09090F] text-sm">
                            <slot name="tableheadertext"></slot>
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="relative" v-if="search">
                            <input class="rounded-lg px-8 py-1 cursor-pointer border" placeholder="Search" v-model="query"
                                @keyup.enter="submitSearch" />
                            <Search class="absolute top-2.5 pl-2" @click="submitSearch" />
                        </div>
                        <slot name="dropdown"></slot>
                        <date-picker v-model:value="date" type="date" range v-if="dateFilter"
                            placeholder="Select date range" value-type="format" format="YYYY-MM-DD"
                            @change="updateDateFilter"></date-picker>
                    </div>
                </div>
                <div>
                    <table class="table-auto border-white bg-white  w-full p-1">
                        <thead>
                            <tr class="border-b border-zinc-300">
                                <th v-for="item in header" :key="item.key" class="font-bold p-2 border-b text-left dark:text-[#131330]">
                                    <slot v-if="slots[`header-${item.key}`]" :name="`header-${item.key}`" v-bind="item" />
                                    <span v-else>{{ item.label }}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-zinc-300 hover:bg-[#195EF71A]" v-for="item in fields" :key='item.id'>
                                <td v-for="headerItem in header" class="px-2 py-3 cursor-pointer dark:text-[#131330]"
                                    @click="$emit('rowClicked', item)">
                                    <slot v-if="slots[`item-${headerItem.key}`]" :name="`item-${headerItem.key}`"
                                        v-bind="item" />
                                    <span v-else>{{ item[headerItem.key] }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="paginated" class="bg-[#F5F5F5] w-full py-2 px-4 flex justify-between gap-5 rounded-b-lg">
                    <div>
                        <p>Viewing {{ pageRangeStart }} - {{ pageRangeEnd }} of {{ totalRecords }} </p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <button @click="prevPage">
                            <LeftIcon />
                        </button>
                        <div>
                            <span v-for="n in totalPages"  @click="updatePage(n)"  class="px-1.5 text-sm bg-white rounded-full w-6 h-6 text-[#6E717C] text-center mx-1 cursor-pointer" 
                             :class="[n === page ? 'border-2 border-[#20E682]'   : 'not-active']"
                            >{{ n }}</span>
                        </div>
                        <button @click="nextPage">
                            <RightIcon />
                        </button>
                    </div>
                    <!-- <div class="flex gap-3">
                        <p>Showing</p>
                        <select name="pageSize" id="" v-model="pageSize" @change="updatePageSize(value)">
                            <option :value="20">20</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup >
import Spinner from './Spinner.vue';
import Search from '../assets/svg/SearchIcon.vue';
import { ref, useSlots , computed, onMounted} from 'vue';
import LeftIcon from '@/assets/svg/LeftIcon.vue';
import RightIcon from '@/assets/svg/RightIcon.vue';
// import DropDown from '../components/DropDown.vue';
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
let perPage = ref(20);



const pageRangeEnd = computed(() => {
    return (props.pageSize * (page.value - 1)) + props.dataCount
});

const pageRangeStart = computed(() => {
    return (props.pageSize * (page.value - 1)) + 1;
});

const empty = computed(() => {
    return props.dataCount === 0  ? true :false
})

const prevPage = () => {
    if (page.value == 1) {
        page.value = 1
        emit('pageChange', page.value)
    } else {
        page.value -= 1;
        emit('pageChange', page.value)
    }
};

const nextPage = () => {
    if (page.value == props.totalPages) {
        page.value = props.totalPages 
        emit('pageChange', page.value)
    } else {
        page.value += 1;
        emit('pageChange', page.value)
        
    }
};

const updatePage = (item) => {
    page.value = item;
    emit('pageChange', item);
}

const updatePageSize = () => {
    emit('pageSizeChange', pageSize.value);
};

const updateDateFilter = () => {
    emit('dateUpdated', date.value);
};

const submitSearch = () => {
    emit('searchQuery', query.value);
    
};

</script>

<style lang="scss" scoped></style> 