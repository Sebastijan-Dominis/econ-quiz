<script setup>
// components
import DarkBtn from './DarkBtn.vue';

// imports
import { useRouter } from 'vue-router';

// props
const props = defineProps(['label']);

// declaring the router
const router = useRouter();

// sending the choice information
const choiceMap = {
    "Nominal GDP": "nom_gdp",
    "GDP PPP": "gdp_ppp",
    "Nominal GDP p/c": "nom_gdp_pc",
    "GDP PPP p/c": "gdp_ppp_pc",
    "Exports as % of GDP": "exports",
    "Imports as % of GDP": "imports",
    "Inflation": "inflation",
    "Unemployment": "unemployment",
    "Total population": "population",
    "Population growth rate": "pop_growth",
    "Population 65+ (% of total)": "pop65up",
    "Population 0-14 (% of total)": "pop0014",
    "Urban population (% of total)": "urban_pop",
    "Fertility rate": "tfr",
    "Life expectancy": "life_expectancy",
    "Net migration": "migration",
    "Literacy rate": "literacy",
    "Poverty headcount ratio": "poverty_headcount_ratio",
    "Health spending (% of GDP)": "health_spending",
    "Arable land (% of land area)": "arable_area",
    "Forest area (% of land area)": "forest_area",
    "Diabetes as % of people ages 20 to 79": "diabetes_20to79",
    "Maternal mortality ratio (per 100k births)": "maternal_mortality",
    "Internet users (% of population)": "internet_users"
}

const whatToDo = () => {
    const newValue = choiceMap[props.label];
    if(router.currentRoute.value.fullPath === "/study-choice") {
        router.push({name: 'study', params: {choice: newValue}})
    } else if (router.currentRoute.value.fullPath === "/quiz-choice") {
        router.push({name: 'home'})
    }
}
</script>

<template>
    <DarkBtn @click="whatToDo" class="w-56 h-14">
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>