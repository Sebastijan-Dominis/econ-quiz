<script setup>
// imports
import DarkBtn from './DarkBtn.vue';
import BrandBtn from './BrandBtn.vue';
import { ref } from 'vue';

// emits
const emits = defineEmits(['confirm', 'decline']);

// send the ref that enables clicking outside of it to close the popup
const confirmation = ref(null);
defineExpose({ confirmation });
</script>

<template>
<div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
<div ref="confirmation" class="fixed w-[425px] h-[234px] border border-brand border-4 bg-bgbtn rounded-3xl text-brand absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
    <h1 class="text-3xl text-wg text-center mt-4"><slot></slot></h1>
    <div class="flex flex-row justify-between px-10 mt-12">
        <DarkBtn @click="$emit('confirm')" class="w-36 h-14">Yes</DarkBtn>
        <BrandBtn @click="$emit('decline')" class="w-36 h-14">No</BrandBtn>
    </div>
</div>
</template>