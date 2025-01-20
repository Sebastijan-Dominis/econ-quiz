<script>
import PageTop from '../components/PageTop.vue';
import LBBtn from '../components/LBBtn.vue';

export default {
  name: 'Leaderboard',
  components: {
    PageTop,
    LBBtn,
  },
  data() {
    return {
      activeBtn: 'Past Month',
    };
  },
  methods: {
    switch(label) {
      this.activeBtn = label;
    },
  },
};
</script>


<template>
    <PageTop>Leaderboard</PageTop>
    <h2 class="text-5xl text-brand text-center mt-16">Top players by cumulative score</h2>
    <div class="flex justify-between mx-32 mt-24" id="btns">
        <LBBtn
      v-for="label in ['Past Month', 'Past Year', 'All Time']"
      :key="label"
      :class="activeBtn === label ? 'active' : 'passive'"
      @click="switch(label)"
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
    .active:hover {
        border-color: #ffa550;
        color: #e6e6e6;
        background-color: rgba(0, 0, 0, 0.45);
    }
    .passive:hover {
        border-color: #1a1a1a;
        color: #1a1a1a;
        background-color: #ffa550;
    }
    .active:active,
    .passive:active {
        scale: 0.98;
    }
</style>