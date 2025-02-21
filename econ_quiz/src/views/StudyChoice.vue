<script setup>
// imports
import Choice from '../components/Choice.vue';
import PageTop from '../components/PageTop.vue';
import { onMounted, onUnmounted } from 'vue';

// scroll button fixed functionality
import { useScrollStore } from '../stores/storeScroll';
const storeScroll = useScrollStore();

onMounted(() => {
  window.addEventListener('scroll', storeScroll.handleScroll);
})

onUnmounted(() => {
  storeScroll.isFixed = false;
  window.removeEventListener('scroll', storeScroll.handleScroll);
})
</script>

<template>
    <PageTop>Choose a Topic to Study</PageTop>
    <Choice></Choice>
</template>