<template>
 <RouterView />
 <vue3-snackbar bottom right :duration="4000"></vue3-snackbar>
</template>

<script setup lang="ts">
 import { RouterView } from 'vue-router';
 import { Vue3Snackbar } from "vue3-snackbar";
</script>
