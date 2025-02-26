<script setup>
// imports
import DarkBtn from './DarkBtn.vue';
import BrandBtn from './BrandBtn.vue';
import { ref } from 'vue';

// emits and props
const emits = defineEmits(['confirm', 'decline']);
const props = defineProps(['customClass']);

// send the ref that enables clicking outside of it to close the popup
const confirmation = ref(null);
defineExpose({ confirmation });
</script>

<template>
<div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
<div ref="confirmation" class="fixed w-[425px] h-[200px] border border-brand border-4 bg-bgbtn rounded-3xl text-brand absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 max-md:w-[250px] max-md:h-[140px]">
    <h1 :class="['text-3xl text-wg text-center max-md:text-base max-md:mx-2', customClass]"><slot></slot></h1>
    <div class="flex flex-row justify-between px-10 mt-8 max-md:px-4 max-md:mt-4">
        <DarkBtn @click="$emit('confirm')" class="buttons">Yes</DarkBtn>
        <BrandBtn @click="$emit('decline')" class="buttons">No</BrandBtn>
    </div>
</div>
</template>

<style scoped>
.buttons {
    width: 9rem;
    height: 3.5rem;
}
@media (max-width: 768px) {
    .buttons {
        width: 6rem;
        height: 2.5rem;
    }
}
</style>