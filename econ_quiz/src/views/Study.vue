<script setup>
// components
import PageTop from '../components/PageTop.vue';

// imports
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import { ref, watchEffect, onMounted, onUnmounted } from 'vue';

// fetching the data
const route = useRoute();
const storeStudy = useStoreStudy();
watchEffect(() => {
    if(route.params.choice) {
        storeStudy.fetchData(route.params.choice);
    }
})

// scroll button fixed functionality
import { useScrollStore } from '../stores/storeScroll';
const storeScroll = useScrollStore();
onMounted(() => {
  window.addEventListener('scroll', storeScroll.handleScroll);
})
onUnmounted(() => {
  storeScroll.isFixed = false;
  window.removeEventListener('scroll', storeScroll.handleScroll);
})

// managing sorted by
const sortedBy = ref('countryData')
const isOpen = ref(false);
const sorter = ref(null);
const onClickOutside = function(event) {
  if(sorter && !sorter.value.contains(event.target)) {
    isOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', onClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
})
</script>

<template>
  <!-- Background Image -->
  <img src="../assets/images/library.jpg" class="fixed top-0 left-0 w-full h-full object-cover z-[-3]" alt="background image showing a library with a flying book in the middle"/>

  <!-- handling the loading and error cases -->
  <div v-if="storeStudy.loading" class="text-3xl text-brand flex justify-center mt-12">Loading...</div>
  <div v-if="storeStudy.error" class="text-3xl text-brand flex justify-center mt-12">Error: {{ storeStudy.error }}</div>

  <!-- once loaded... -->
  <div v-if="!storeStudy.loading && !storeStudy.error">
    <PageTop customH1Class="text-8xl max-xl:text-7xl max-lg:text-6xl max-md:text-6xl">Library</PageTop>
    <h1 class="flex justify-center mt-20 text-brand text-4xl xl:text-5xl 2xl:text-6xl">{{ route.params.choice }}</h1>

    <!-- the sorter  -->
    <div ref="sorter" class="fixed top-6 right-10 border border-brand rounded-2xl border-2 text-wg" :class="{'max-lg:!right-4': storeScroll.isFixed}">
      <div class="w-36 p-4" :class="{'max-lg:w-24': storeScroll.isFixed}">
      <!-- Button to toggle sorter box -->
      <button @click="isOpen = !isOpen" class="flex justify-between items-center w-full text-lg font-bold" :class="{'max-lg:!justify-center': storeScroll.isFixed}">
        <span v-show="!storeScroll.isFixed || true">Sort</span>
        <svg :class="{'rotate-90': isOpen}" class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

    <!-- sorter options (hidden by default) -->
        <div v-show="isOpen" class="mt-4 space-y-2">
          <div class="flex items-center">
            <input type="radio" id="sorter1" class="mr-2" name="sorter" value="countryData" checked v-model="sortedBy" />
            <label for="sorter1" v-show="!storeScroll.isFixed">Country names A-Z</label>
            <label for="sorter1" v-show="storeScroll.isFixed">A-Z</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter2" class="mr-2" name="sorter" value="countryDataZA" v-model="sortedBy" />
            <label for="sorter2" v-show="!storeScroll.isFixed">Country names Z-A</label>
            <label for="sorter2" v-show="storeScroll.isFixed">Z-A</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter3" class="mr-2" name="sorter" value="countryDataHL" v-model="sortedBy" />
            <label for="sorter3" v-show="!storeScroll.isFixed">Value - biggest to smallest</label>
            <label for="sorter3" v-show="storeScroll.isFixed">High-Low</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter4" class="mr-2" name="sorter" value="countryDataLH" v-model="sortedBy" />
            <label for="sorter4" v-show="!storeScroll.isFixed">Value - smallest to biggest</label>
            <label for="sorter4" v-show="storeScroll.isFixed">Low-High</label>
          </div>
        </div>
      </div>
    </div>

    
      <ul class="mt-16 lg:mt-28">
        <li v-for="[country, value] of storeStudy[sortedBy].value" :key="country" class="flex mx-32 md:mx-40 lg:mx-56 xl:mx-72 2xl:mx-[500px] justify-between my-6 text-brand text-xl xl:text-2xl 2xl:text-3xl font-bold">
          <div>{{ country }}:</div> 
          <div>
            <span>{{ Math.round(value).toLocaleString() }}</span>
            <span v-if="route.params.choice === 'Exports as % of GDP' || route.params.choice === 'Imports as % of GDP'">%</span>
          </div>
        </li>
      </ul>
  </div>
</template>