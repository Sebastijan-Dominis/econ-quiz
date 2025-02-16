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
      <h2 class="flex justify-center text-brand text-6xl">{{ route.params.choice }}</h2>
      <ul>
        <li v-for="(value, country) in storeStudy.countryData.value" :key="country" class="flex justify-between mx-48 xl:mx-96 my-6 text-brand text-xl">
          <div>{{ country }}:</div> 
          <div>{{ value }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>