<script setup>
// the function to go to the previous view
import { useBack } from '../composables/useBack';
const { back } = useBack();
</script>

<template>
    <div class="py-6 px-10">
        <button @click="back" class="w-36 h-14 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg fixed hover:bg-brand hover:text-bg hover:border-bg active:scale-98 max-lg:w-32 max-lg:h-12">Return</button>
    </div>
</template>