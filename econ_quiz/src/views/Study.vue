<script setup>
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
</script>

<template>
  <div>
    <div v-if="storeStudy.loading">Loading...</div>
    <div v-if="storeStudy.error">{{ storeStudy.error }}</div>
    <div v-if="!storeStudy.loading && !storeStudy.error">
      <h2 class="flex justify-center text-brand text-6xl xl:text-7xl 2xl:text-8xl mt-4 xl:mt-8">{{ route.params.choice }}</h2>
      <ul class="mt-20 lg:mt-28">
        <li v-for="(value, country) in storeStudy.countryData.value" :key="country" class="flex mx-32 md:mx-40 lg:mx-56 xl:mx-72 2xl:mx-[500px] justify-between my-6 text-brand text-xl xl:text-2xl 2xl:text-3xl">
          <div>{{ country }}:</div> 
          <div>{{ value }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>