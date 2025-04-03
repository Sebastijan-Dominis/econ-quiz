<script setup>
// the function to go to the previous view
import { useBack } from '../composables/useBack';
const { back } = useBack();
</script>

<template>
    <div class="py-6 px-10 max-md:px-6 max-md:pt-4">
        <button @click="back" class="w-36 h-14 xl:h-16 xl:w-44 xl:text-lg 2xl:h-20 2xl:w-52 2xl:text-xl rounded-full bg-bgbtn border-brand border-2 font-medium text-wg fixed lg:hover:bg-brand lg:hover:text-bg lg:hover:border-bg lg:active:scale-98 max-lg:w-32 max-lg:h-12 returnBtn">Return</button>
    </div>
</template>

<style>
@media (min-width: 1280px) and (max-height: 670px) {
    .returnBtn {
        height: 3.5rem;
        width: 9rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
}
@media (min-width: 1536px) and (max-height: 750px) {
    .returnBtn {
        height: 4rem;
        width: 11rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}
@media (min-width: 1536px) and (max-height: 670px) {
    .returnBtn {
        height: 3.5rem;
        width: 9rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
}
</style>