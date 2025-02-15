<script setup>
// components and composables
import ReturnBtn from '../components/ReturnBtn.vue';
import { useBack } from '../composables/useBack';

// getting the back function
const {back} = useBack();
</script>

<template>
    <ReturnBtn @click="back"></ReturnBtn>
</template>