<script setup>
// props
const props = defineProps(['customClass']);
</script>

<template>
    <button :class="['w-24 h-12 text-wg bg-bgbtn border border-2 border-brand rounded-xl md:w-32 md:h-14 lg:w-40 lg:h-16 lg:hover:bg-brand lg:hover:text-bg lg:active:scale-[0.98] xl:text-xl xl:w-48 xl:h-20 navBtn', customClass]"><slot></slot></button>
</template>

<style>
@media (min-width: 1024px) and (max-height: 700px) {
    .navBtn {
        width: 3.5rem;
        height: 8rem;
    }
}
@media (min-width: 1024px) and (min-height: 701px) and  (max-height: 800px) {
    .navBtn {
        width: 8rem;
        height: 3.5rem;
    }
}
</style>