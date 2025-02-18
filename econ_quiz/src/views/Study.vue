<script setup>
// components
import PageTop from '../components/PageTop.vue';

// imports
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import { watchEffect } from 'vue';

// declaring route and pinia store
const route = useRoute();
const storeStudy = useStoreStudy();

// watch for route parameter changes and fetch data
watchEffect(() => {
    if(route.params.choice) {
        storeStudy.fetchData(route.params.choice);
    }
})

// scroll button fixed functionality
import { provide, ref, onMounted, onUnmounted } from 'vue';
const isFixed = ref(false);

const handleScroll = () => {
  isFixed.value = window.scrollY >= 70;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})

provide("isFixed", isFixed);
</script>

<template>
  <!-- Background Image -->
  <img src="../assets/images/library.jpg" class="fixed top-0 left-0 w-full h-full object-cover z-[-3]" alt="background image showing a library with a flying book in the middle"/>
  <div>
    <div v-if="storeStudy.loading" class="text-3xl text-brand flex justify-center mt-12">Loading...</div>
    <div v-if="storeStudy.error" class="text-3xl text-brand flex justify-center mt-12">Error: {{ storeStudy.error }}</div>
    <div v-if="!storeStudy.loading && !storeStudy.error">
      <PageTop customH1Class="text-8xl max-xl:text-7xl max-lg:text-6xl max-md:text-6xl">Library</PageTop>
      <h1 class="flex justify-center mt-20 text-brand text-4xl xl:text-5xl 2xl:text-6xl">{{ route.params.choice }}</h1>
      <ul class="mt-16 lg:mt-28">
        <li v-for="(value, country) in storeStudy.countryData.value" :key="country" class="flex mx-32 md:mx-40 lg:mx-56 xl:mx-72 2xl:mx-[500px] justify-between my-6 text-brand text-xl xl:text-2xl 2xl:text-3xl font-bold">
          <div>{{ country }}:</div> 
          <div>
            <span>{{ Math.round(value).toLocaleString() }}</span>
            <span v-if="route.params.choice === 'Exports as % of GDP' || route.params.choice === 'Imports as % of GDP'">%</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>