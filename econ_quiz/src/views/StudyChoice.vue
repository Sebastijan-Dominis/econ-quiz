<script setup>
// imports
import Choice from '../components/Choice.vue';
import PageTop from '../components/PageTop.vue';
import { onMounted, onUnmounted } from 'vue';

// scroll button fixed functionality
import { useStoreFixedBtn } from '../stores/storeFixedBtn';
const storeFixedBtn = useStoreFixedBtn();

onMounted(() => {
  storeFixedBtn.isFixed = true;
})

onUnmounted(() => {
  storeFixedBtn.isFixed = false;
})
</script>

<template>
    <PageTop>Choose a Topic to Study</PageTop>
    <Choice></Choice>
</template>