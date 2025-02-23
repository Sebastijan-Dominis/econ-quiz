<script setup>
// enabling the fixed button functionality
import { useStoreFixedBtn } from '../stores/storeFixedBtn';
const storeFixedBtn = useStoreFixedBtn();

// the function to go to the previous view
import { useBack } from '../composables/useBack';
const { back } = useBack();
</script>

<template>
    <div class="py-6 px-10">
        <button @click="back" class="w-36 h-14 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute hover:bg-brand hover:text-bg hover:border-bg active:scale-98 max-lg:w-32 max-lg:h-12" :class="{'!fixed top-6 left-10! font-normal': storeFixedBtn.isFixed}, {'!w-24 md:!w-28 lg:!w-36': storeFixedBtn.isFixedStudy}">Return</button>
    </div>
</template>