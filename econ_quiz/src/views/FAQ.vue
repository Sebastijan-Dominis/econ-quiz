<script setup>
// imports
import ReturnBtn from '../components/ReturnBtn.vue';
import { useStoreFAQ } from '../stores/storeFAQ';

const storeFAQ = useStoreFAQ();
</script>

<template>
    <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="fixed bottom-0 right-0 w-64 max-2xl:hidden z-[-1]">
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
    <ReturnBtn></ReturnBtn>
    <h1 class="text-brand text-4xl justify-self-center xl:text-5xl 2xl:text-6xl mb-16">FAQ</h1>
    <p v-for="faq in storeFAQ.faqs" class="text-lg text-brand mx-8 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 xl:text-xl 2xl:text-2xl">
        Q: {{ faq.q }}<br>A: {{ faq.a }}<br><br>
    </p>
</template>