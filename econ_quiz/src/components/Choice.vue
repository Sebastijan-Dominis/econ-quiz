<script>
import ChooseBtn from './ChooseBtn.vue';

export default {
  name: 'ChooseBtnParent',
  components: {
    ChooseBtn,
  },
  data() {
    return {
      columns: [
        ['Button 1', 'Button 2'],
        ['Button 3'],
        ['Button 4', 'Button 5'],
      ],
      titles: ['Economic Indicators', 'Demographic Indicators', 'Other Indicators']
    }
  }
}
</script>

<template>
<div class="grid grid-cols-3 mx-32 gap-12">
    <div v-for="(column, index) in columns" :key="index" class="flex flex-col gap-2.5">
        <h2 class="text-3xl text-brand font-bold">{{ titles[index] }}</h2>
      <ChooseBtn v-for="(button, i) in column" :key="i" :label="button" />
    </div>
  </div>
</template>
