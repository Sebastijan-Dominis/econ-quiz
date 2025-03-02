<!-- <script setup>
// imports
import { useStoreGenerator } from '../stores/storeGenerator';
import { useStoreStudy } from '../stores/storeStudy';
import DarkBtn from '../components/DarkBtn.vue';
import { onBeforeMount, ref } from 'vue';

const storeGenerator = useStoreGenerator();
const storeStudy = useStoreStudy();

onBeforeMount(() => {
    storeStudy.fetchData("Nominal GDP");
})

const generated = ref('waiting...');
const fetchAnswer = async() => {
    const response = await storeGenerator.generate("Nominal GDP", "noob", storeStudy.countryData.value);
    generated.value = response;
}
</script>

<template>
<DarkBtn @click="fetchAnswer"></DarkBtn>
<h1 class="text-xl text-brand font-bold">{{ generated }}</h1>
</template> -->

<template></template>