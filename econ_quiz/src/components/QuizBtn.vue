<script setup>
// props
const props = defineProps(['option'])
</script>

<template>
    <button class="w-56 h-14 text-xs rounded-lg md:text-sm md:rounded-xl md:w-64 md:h-24 lg:text-base lg:rounded-3xl lg:w-72 lg:h-32 2xl:w-96 2xl:h-40 2xl:text-xl border border-2 border-brand bg-bgbtn text-wg font-bold lg:hover:bg-brand lg:hover:text-bg lg:active:scale-[0.98] lg:hover:scale-[1.02] quizBtn"><slot></slot></button>
</template>

<style>
@media (min-width: 1024px) and (max-height: 700px) {
    .quizBtn {
        width: 14rem;
        height: 4.5rem;
    }
}
@media (min-width: 1024px) and (min-height: 701px) and  (max-height: 800px) {
    .quizBtn {
        width: 16rem;
        height: 6rem;
    }
}
@media (min-width: 1280px) and (min-height: 801px) and (max-height: 940px) {
    .quizBtn {
        width: 18rem;
        height: 8rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
}
</style>