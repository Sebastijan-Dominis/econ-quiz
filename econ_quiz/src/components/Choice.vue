<script setup>
// imports
import {ref} from 'vue';
import ChooseBtn from './ChooseBtn.vue';
import { useStoreStudy } from '../stores/storeStudy';

const storeStudy = useStoreStudy();

// titles for columns
const titles = ref(
  ['Economic Indicators', 'Demographic Indicators', 'Other Indicators']
)
</script>

<template>
<div class="grid grid-cols-3 max-lg:grid-cols-1 mx-28 gap-12 mb-4">
  <div v-for="(column, index) in storeStudy.columns" :key="index" class="flex flex-col items-center mt-12">
      <h2 class="text-lg 2xl:text-xl text-brand font-bold text-center titles">{{ titles[index] }}</h2>
    <ChooseBtn v-for="(button, i) in column" :key="i" :label="button" class="mt-6"/>
  </div>
</div>
</template>

<style>
@media (min-width: 1280px) and (max-height: 940px) {
  .titles {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
}
</style>