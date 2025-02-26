<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import LBBtn from '../components/LBBtn.vue';
import { ref } from 'vue';

// filtering choice
const activeBtn = ref('Past Month');
const setActive = function(label) {
  activeBtn.value = label;
}
</script>

<template>
    <PageTop>Leaderboard</PageTop>
    <h2 class="text-5xl text-brand text-center mt-16 max-lg:text-4l max-md:text-3xl">Top players by cumulative score</h2>
    <div class="flex justify-between mx-32 mt-24 max-xl:mx-16 max-lg:mx-4">
        <LBBtn
      v-for="label in ['Past Month', 'Past Year', 'All Time']"
      :key="label"
      :class="activeBtn === label ? 'active' : 'passive'"
      @click="setActive(label)"
    >
      {{ label }}
    </LBBtn>
    </div>
</template>

<style scoped>
    .active {
        color: var(--bg);
        background-color: var(--brand);
    }
</style>