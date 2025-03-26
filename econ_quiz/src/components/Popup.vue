<script setup>
// imports
import DarkBtn from './DarkBtn.vue';
import BrandBtn from './BrandBtn.vue';
import { ref } from 'vue';

// emits and props
const emits = defineEmits(['confirm', 'decline']);
const props = defineProps(['customClass1', 'customClass2']);

// send the ref that enables clicking outside of it to close the popup
const confirmation = ref(null);
defineExpose({ confirmation });
</script>

<template>
<div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
<div ref="confirmation" class="fixed w-[auto] max-w-lg px-4 h-auto pb-4 border border-brand border-4 bg-bgbtn rounded-3xl text-brand fixed left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
    <h1 class="text-xl text-wg text-center md:text-3xl mt-2"><slot></slot></h1>
    <div class="flex justify-between gap-x-8 mt-4 md:gap-x-16 md:mt-8 md:mx-4">
        <DarkBtn @click="$emit('confirm')" :class="['buttons', customClass1]">Yes</DarkBtn>
        <BrandBtn @click="$emit('decline')" :class="['buttons', customClass2]">No</BrandBtn>
    </div>
</div>
</template>

<style scoped>
.buttons {
    width: 9rem;
    height: 3.5rem;
}
</style>