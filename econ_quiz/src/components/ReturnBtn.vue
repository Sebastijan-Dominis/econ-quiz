<script setup>
// enabling the fixed button functionality
import { inject, ref } from 'vue';
let isFixed = inject("isFixed")

// apparently it sometimes crashes without this part of the code, saying that isfixed.value is undefined, so this makes sure that doesn't happen
let isFixedRef = ref(false);
import { watchEffect } from 'vue';
watchEffect(() => {
  isFixedRef.value = isFixed?.value;
});
</script>

<template>
    <div class="py-6 px-10">
        <button class="w-36 h-14 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute hover:bg-brand hover:text-bg hover:border-bg active:scale-98 max-lg:w-32 max-lg:h-12" :class="{'!fixed top-6 left-6 !w-24 font-normal md:!w-28 lg:!w-32 xl:!w-36': isFixedRef}">Return</button>
    </div>
</template>