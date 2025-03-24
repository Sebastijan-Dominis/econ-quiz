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
<div class="grid grid-cols-3 max-lg:grid-cols-1 mx-32 gap-12">
  <div v-for="(column, index) in storeStudy.columns" :key="index" class="flex flex-col items-center mt-12">
      <h2 class="text-3xl text-brand font-bold text-center">{{ titles[index] }}</h2>
    <ChooseBtn v-for="(button, i) in column" :key="i" :label="button" class="mt-6"/>
  </div>
</div>
</template>
