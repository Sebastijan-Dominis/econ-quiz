<script setup>
// components
import ChooseBtn from './ChooseBtn.vue';

// imports
import {ref} from 'vue';

// columns for choosing the quiz
const columns = ref(
  [
    ['Nominal GDP', 'GDP PPP', 'Nominal GDP p/c', 'GDP PPP p/c', 'Exports as % of GDP', 'Imports as % of GDP', 'Inflation', 'Unemployment'],
    ['Total population', 'Population growth rate', 'Population 65+\n(% of total)', 'Population 0-14\n(% of total)', 'Urban population\n(% of total)', 'Fertility rate', 'Life expectancy', 'Dependency ratio'],
    ['Literacy rate', 'Poverty headcount ratio', 'Health spending\n(% of GDP)', 'Arable land\n(% of land area)', 'Forest area\n(% of land area)', 'Net migration', 'Maternal mortality ratio\n(per 100k births)', 'Internet users\n(% of population)'],
  ]
)

// titles for columns
const titles = ref(
  ['Economic Indicators', 'Demographic Indicators', 'Other Indicators']
)
</script>

<template>
<div class="grid grid-cols-3 max-lg:grid-cols-1 mx-32 gap-12">
  <div v-for="(column, index) in columns" :key="index" class="flex flex-col items-center mt-12">
      <h2 class="text-3xl text-brand font-bold text-center">{{ titles[index] }}</h2>
    <ChooseBtn v-for="(button, i) in column" :key="i" :label="button.replace(/\n/g, ' ')" class="mt-6"/>
  </div>
</div>
</template>
