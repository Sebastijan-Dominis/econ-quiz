<script setup>
// components
import DarkBtn from './DarkBtn.vue';

// props
const props = defineProps(['label']);
</script>

<template>
    <DarkBtn class="w-56 h-14">
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>