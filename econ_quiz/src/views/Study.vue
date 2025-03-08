<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import { ref, watchEffect, onMounted, onUnmounted, computed } from 'vue';

// fetching the data
const route = useRoute();
const storeStudy = useStoreStudy();

let originalValue = null;
watchEffect(() => {
  if(route.params.choice) {
    originalValue = storeStudy.reverseChoiceMap[route.params.choice];
    storeStudy.fetchData(originalValue);
  }
})

// fixed button functionality
import { useStoreFixedBtn } from '../stores/storeFixedBtn';
const storeFixedBtn = useStoreFixedBtn();
onMounted(() => {
  storeFixedBtn.isFixed = true;
  storeFixedBtn.isFixedStudy = true;
})
onUnmounted(() => {
  storeFixedBtn.isFixed = false;
  storeFixedBtn.isFixedStudy = false;
})

// managing sorted by
const sortedBy = ref('countryData')
const isOpen = ref(false);
const sorter = ref(null);
const onClickOutside = function(event) {
  if(sorter.value && !sorter.value.contains(event.target)) {
    isOpen.value = false;
  }
}
onMounted(() => {
  document.addEventListener('click', onClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
})

// managing the sorted by button appearance depending on screen size
const screenSize = ref(window.innerWidth);
const scrolled = ref(window.scrollY);

const resized = function() {
  screenSize.value = window.innerWidth;
}
const scroll = function() {
  scrolled.value = window.scrollY;
}

onMounted(() => {
  window.addEventListener('resize', resized);
  window.addEventListener('scroll', scroll);
})
onUnmounted(() => {
  window.removeEventListener('resize', resized);
  window.removeEventListener('scroll', scrolled);
})

const manageScreenSize = computed(() => {
  return screenSize.value >= 1024 || scrolled.value <= 180;
})
</script>

<template>
  <!-- Background Image -->
  <img src="../assets/images/library.jpg" class="fixed top-0 left-0 w-full h-full object-cover z-[-3]" alt="background image showing a library with a flying book in the middle"/>
  <!-- Semi-Transparent Overlay -->
  <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-45 z-[-2]"></div>

  <!-- handling the loading and error cases -->
  <div v-if="storeStudy.loading" class="text-3xl text-brand flex justify-center mt-12 font-bold">Loading...</div>
  <div v-if="storeStudy.error" class="text-3xl text-brand flex justify-center mt-12 font-bold">Error: {{ storeStudy.error }}</div>

  <!-- once loaded... -->
  <div v-if="!storeStudy.loading && !storeStudy.error">
    <PageTop customH1Class="text-8xl max-xl:text-7xl max-lg:text-6xl max-md:text-6xl font-bold">Library</PageTop>
    <h1 class="flex justify-center mt-20 text-brand text-4xl xl:text-5xl 2xl:text-6xl font-bold">{{ originalValue }}</h1>
    <h3 class="flex justify-center mt-6 text-brand text-2xl xl:text-3xl 2xl:text-4xl font-bold gap-x-1">Data from
      <span>{{ storeStudy.year[originalValue] }}</span>
    </h3>
    <!-- cozy tea on a table -->
    <img src="../assets/images/table.png" alt="a table" class="max-lg:hidden fixed bottom-0 right-0 w-56">
    <img src="../assets/gifs/tea.gif" alt="a cup of warm tea" class="max-lg:hidden fixed bottom-28 right-0 w-48">

    <!-- cozy fireplace -->
    <img src="" alt="candles" class="max-lg:hidden fixed bottom-80 left-0 w-56">

    <!-- the sorter  -->
    <div ref="sorter" class="fixed top-6 right-10 border border-brand rounded-2xl border-2 text-wg bg-bgbtn" :class="{'max-lg:!right-4': storeFixedBtn.isFixed}">
      <div class="w-36 p-4" :class="{'max-lg:w-24': storeFixedBtn.isFixed}">
      <!-- Button to toggle sorter box -->
      <button @click="isOpen = !isOpen" class="flex justify-between items-center w-full text-lg font-bold" :class="{'max-lg:!justify-center': storeFixedBtn.isFixed}">
        <span v-show="manageScreenSize">Sort By</span>
        <svg :class="{'rotate-90': isOpen}" class="w-6 h-6 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

    <!-- sorter options (hidden by default) -->
        <div v-show="isOpen" class="mt-4 space-y-2">
          <div class="flex items-center">
            <input type="radio" id="sorter1" class="mr-2" name="sorter" value="countryData" checked v-model="sortedBy" />
            <label for="sorter1" v-show="manageScreenSize">Country names A-Z</label>
            <label for="sorter1" v-show="!manageScreenSize">A-Z</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter2" class="mr-2" name="sorter" value="countryDataZA" v-model="sortedBy" />
            <label for="sorter2" v-show="manageScreenSize">Country names Z-A</label>
            <label for="sorter2" v-show="!manageScreenSize">Z-A</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter3" class="mr-2" name="sorter" value="countryDataHL" v-model="sortedBy" />
            <label for="sorter3" v-show="manageScreenSize">Value - biggest to smallest</label>
            <label for="sorter3" v-show="!manageScreenSize">High-Low</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter4" class="mr-2" name="sorter" value="countryDataLH" v-model="sortedBy" />
            <label for="sorter4" v-show="manageScreenSize">Value - smallest to biggest</label>
            <label for="sorter4" v-show="!manageScreenSize">Low-High</label>
          </div>
        </div>
      </div>
    </div>

      <ul class="mt-16 lg:mt-28">
        <li v-for="[country, value] of storeStudy[sortedBy].value" :key="country" class="flex mx-32 md:mx-40 lg:mx-56 xl:mx-72 2xl:mx-[500px] justify-between my-6 text-brand text-xl xl:text-2xl 2xl:text-3xl font-bold">
          <div>{{ country }}:</div> 
          <div>
            <div v-if="storeStudy.largeNumsDollars.has(originalValue)">
              <span>${{ Math.round(value).toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNumsPercentages.has(originalValue)">
              <span>{{ value.toFixed(2) }}%</span>
            </div>
            <div v-if="storeStudy.largeNums.has(originalValue)">
              <span>{{ Math.round(value).toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNums.has(originalValue)">
              <span>{{ value.toFixed(2) }}</span>
            </div>
          </div>
        </li>
      </ul>
  </div>
</template>