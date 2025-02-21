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
      @toggle="setActive(label)"
    >
      {{ label }}
    </LBBtn>
    </div>
</template>

<style scoped>
    .active {
        border-color: #1a1a1a;
        color: #1a1a1a;
        background-color: #ffa550;
    }
    .passive {
        border-color: #ffa550;
        color: #e6e6e6;
        background-color: rgba(0, 0, 0, 0.45);
    }
    .active:hover,
    .passive:hover {
        scale: 1.02;
    }
    /* .passive:hover {
        border-color: #1a1a1a;
        color: #1a1a1a;
        background-color: #ffa550;
    } */
    .active:active,
    .passive:active {
        scale: 0.98;
    }
</style>