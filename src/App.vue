<template>
 <RouterView />
 <vue3-snackbar bottom right :duration="4000"></vue3-snackbar>
</template>

<script setup lang="ts">
 import { RouterView } from 'vue-router';
 import { Vue3Snackbar } from "vue3-snackbar";
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
</style>
