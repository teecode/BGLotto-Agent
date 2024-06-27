<template>
    <div ref="container" class="flex gap-4 items-center justify-center mb-4">
        <input v-for="n in length" :key="n" v-model="otpArray[n - 1]" type="tel" autocomplete="off" maxlength="1"
            @keyup="(e) => handleEnter(e, n-1)"
            class="text-white text-center w-12 bg-transparent border border-[#A3AED0] p-3 rounded-md text-sm outline-none focus:border-blue-700">
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";

const otpProps = defineProps({
    length: {
        type: Number,
        default: 4
    }
})

const otpArray = ref([]);

const container = ref();

const otpEmit = defineEmits(['entered']);

onMounted(() => {
    for(let i =0; i < otpProps.length; i++){
        otpArray.value[i] = null
    }
});

const handleEnter = (e, i) =>{
    const children = container.value.children;
    const keypressed = e.key;

    if(i > 0 && (keypressed==='Backspace' || keypressed==='Delete')){
        otpArray.value[i] = null
        setTimeout(() => {
            children[i-1].focus()
        }, 100)
    }

    else {
        const matched = keypressed.match(/^[0-9]$/)
        if(!matched){
            otpArray.value[i] = null
            return
        }

        else if(i < otpProps.length - 1){
            setTimeout(() => {
                children[i+1].focus()
            }, 100)
        }
        checkOTP()
    }
}


const checkOTP = () =>{
     const children = container.value.children;

     let flag = true;

     for(let i=0; i < otpProps.length - 1; i++){
        if(otpArray.value[i] == null)
        {
            children[i].classList.add('border-red-500')
            flag = false;
        }
        else {
             children[i].classList.remove('border-red-500')
        }
     }

    if(flag)
    otpEmit('entered', otpArray.value.join(''))

}



</script>

<style lang="scss" scoped></style>