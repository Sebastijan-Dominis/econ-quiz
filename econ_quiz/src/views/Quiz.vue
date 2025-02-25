<script setup>
// imports
import { useStoreQuiz } from '../stores/storeQuiz';
import { useRoute } from 'vue-router';

// fetching the questions
const storeQuiz = useStoreQuiz();
const route = useRoute();
</script>

<template>
    <button @click="storeQuiz.fetchQuiz(route.params.choice, route.params.difficulty)" class="text-8xl text-brand mt-6 p-10 border border-2 border-brand rounded-full flex mx-auto bg-bgbtn">test</button>
</template>