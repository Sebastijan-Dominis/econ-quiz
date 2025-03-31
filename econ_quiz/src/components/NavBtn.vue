<script setup>
// props
const props = defineProps(['customClass']);
</script>

<template>
    <button :class="['w-24 h-12 text-wg bg-bgbtn border border-2 border-brand rounded-xl md:w-32 md:h-14 lg:w-40 lg:h-16 lg:hover:bg-brand lg:hover:text-bg lg:active:scale-[0.98] xl:text-xl xl:w-48 xl:h-20', customClass]"><slot></slot></button>
</template>