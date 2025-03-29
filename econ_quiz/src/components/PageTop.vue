<script setup>
// components
import ReturnBtn from '../components/ReturnBtn.vue';

// props
const props = defineProps(['customH1Class']);
</script>

<template>
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
    <ReturnBtn></ReturnBtn>
    <h1 :class="['text-brand text-6xl justify-self-center max-lg:text-5xl max-md:text-4xl max-md:w-64 max-md:pt-8 text-center', customH1Class]"><slot></slot></h1>
</template>