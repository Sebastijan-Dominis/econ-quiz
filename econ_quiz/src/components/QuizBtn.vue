<script setup>
// props
const props = defineProps(['option'])
</script>

<template>
    <button class="w-56 h-14 text-xs rounded-lg md:text-sm md:rounded-xl md:w-64 md:h-24 lg:text-base lg:rounded-3xl lg:w-72 lg:h-32 2xl:w-96 2xl:h-40 2xl:text-xl border border-2 border-brand bg-bgbtn text-wg font-bold lg:hover:bg-brand lg:hover:text-bg lg:active:scale-[0.98] lg:hover:scale-[1.02]"><slot></slot></button>
</template>