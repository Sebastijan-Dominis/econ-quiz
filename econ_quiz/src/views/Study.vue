<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import { ref, watchEffect, onMounted, onUnmounted, computed } from 'vue';
import Dropdown from '../components/Dropdown.vue';

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

// managing sorted by
const sortedBy = ref('countryData')
const isOpen = ref(false);
const sorter = ref(null);
const sorterOptions = ref(null);
const onClickOutside = function(event) {
  if(sorter.value && sorter.value.contains(event.target) && (!sorterOptions.value || (sorterOptions.value && !sorterOptions.value.contains(event.target))) ) {
    isOpen.value = !isOpen.value;
  }
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
    <PageTop customH1Class="text-8xl max-xl:text-7xl max-lg:text-6xl max-md:text-6xl font-bold title">Library</PageTop>
    <h1 class="flex justify-center mt-20 text-brand text-4xl xl:text-5xl 2xl:text-6xl font-bold topic">{{ originalValue }}</h1>
    <h3 class="flex justify-center mt-6 text-brand text-2xl xl:text-3xl 2xl:text-4xl font-bold gap-x-1">Data from
      <span>{{ storeStudy.year[originalValue] }}</span>
    </h3>
    <!-- cozy tea on a table -->
    <img src="../assets/images/table.png" alt="a table" class="max-lg:hidden fixed bottom-0 right-0 w-56">
    <img src="../assets/gifs/tea.gif" alt="a cup of warm tea" class="max-lg:hidden fixed bottom-28 right-0 w-48">

    <!-- the sorter  -->
    <div ref="sorter" class="fixed top-4 right-6 border border-brand rounded-2xl border-2 text-wg bg-bgbtn cursor-pointer">
      <div class="w-24 p-3 md:w-36 md:p-4 lg:w-48 lg:p-6 xl:w-56 xl:p-8 2xl:w-64 2xl:p-10">
      <!-- Button to toggle sorter box -->
      <button class="flex justify-between items-center w-full text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
        <span v-show="manageScreenSize">Sort By</span>
        <Dropdown :class="{'rotate-90': isOpen}"></Dropdown>
      </button>

    <!-- sorter options (hidden by default) -->
        <div ref="sorterOptions" v-show="isOpen" class="mt-4 xl:mt-6 space-y-2">
          <div class="flex items-center">
            <input type="radio" id="sorter1" class="sorterInput" name="sorter" value="countryData" checked v-model="sortedBy"/>
            <label class="sorterLabel" for="sorter1" v-show="manageScreenSize">Country names A-Z</label>
            <label class="sorterLabel" for="sorter1" v-show="!manageScreenSize">A-Z</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter2" class="sorterInput" name="sorter" value="countryDataZA" v-model="sortedBy" />
            <label class="sorterLabel" for="sorter2" v-show="manageScreenSize">Country names Z-A</label>
            <label class="sorterLabel" for="sorter2" v-show="!manageScreenSize">Z-A</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter3" class="sorterInput" name="sorter" value="countryDataHL" v-model="sortedBy" />
            <label class="sorterLabel" for="sorter3" v-show="manageScreenSize">Value - biggest to smallest</label>
            <label class="sorterLabel" for="sorter3" v-show="!manageScreenSize">High-Low</label>
          </div>
          <div class="flex items-center">
            <input type="radio" id="sorter4" class="sorterInput" name="sorter" value="countryDataLH" v-model="sortedBy" />
            <label class="sorterLabel" for="sorter4" v-show="manageScreenSize">Value - smallest to biggest</label>
            <label class="sorterLabel" for="sorter4" v-show="!manageScreenSize">Low-High</label>
          </div>
        </div>
      </div>
    </div>

    <ul class="mt-16 lg:mt-28 mainData">
      <li v-for="[country, value] of storeStudy[sortedBy].value" :key="country" class="flex mx-8 md:mx-44 lg:mx-56 xl:mx-72 2xl:mx-[500px] justify-between my-6 text-brand text-base md:text-xl xl:text-2xl 2xl:text-3xl font-bold items-center">
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

<style>
.sorterInput {
  cursor: pointer;
}
.sorterLabel {
  padding-left: 0.5rem;
  cursor: pointer;
}

/* small tablets */
@media (min-width: 768px) {
  .sorterInput {
    scale: 1.1;
  }
  .sorterLabel {
    padding-left: 0.75rem;
  }
}

/* tablets and small laptops */
@media (min-width: 1024px) {
  .sorterInput {
    scale: 1.2;
  }
  .sorterLabel {
    font-size: 1.125rem;
    line-height: 1.75rem;
    padding-left: 1rem;
  }
}

/* laptops */
@media (min-width: 1280px) {
  .sorterInput {
    scale: 1.3;
  }
  .sorterLabel {
    font-size: 1.25rem;
    line-height: 1.75rem;
    padding-left: 1.25rem;
  }
}

/* large screens */
@media (min-width: 1536px) {
  .sorterInput {
    scale: 1.5;
  }
  .sorterLabel {
    font-size: 1.5rem;
    line-height: 2rem;
    padding-left: 1.5rem;
  }
}

/* small - midsize phones */
@media (max-width: 640px) and (max-height: 850px) {
  .title {
    font-size: 3rem;
    line-height: 1;
  }
  .topic {
    margin-top: 2.5rem;
  }
  .mainData {
    margin-top: 3rem;
  }
}
</style>