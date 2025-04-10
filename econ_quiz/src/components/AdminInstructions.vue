``<script setup>
// imports
import { useStoreEditQuiz } from '../stores/storeEditQuiz';
import DarkBtn from './DarkBtn.vue';

const storeEditQuiz = useStoreEditQuiz();
</script>

<template>
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
        <div class="fixed top-0 left-0 w-full h-[90vh] text-brand mt-16 px-8 md:px-24 overflow-y-auto">
            <h1 class="text-3xl justify-self-center mb-8">Instructions</h1>
            <p class="mt-4"><b>name</b> = the name of the topic (e.g. GDP PPP); the name is allowed to differ from the official one from world bank data but it has to be clear and concise since displayName will have to fit in the buttons</p>
            <p class="mt-4"><b>displayName</b> = how the name displays on buttons (same as name but add \n where appropriate)</p>
            <p class="mt-4"><b>shortName</b> = a part of the url (more concise than name but still meaningful and clear enough)</p>
            <p class="mt-4"><b>key</b> = used for fetching data from world bank data api, can be found on their website; GenAI can also be helpful for finding it</p>
            <p class="mt-4"><b>year</b> = which year the data will be fetched for; should not be more than 5 years old but also has to contain data for at least 50 countries; should be the most recent while keeping these restraints in mind</p>
            <p class="mt-4"><b>indicator</b> = which of the three indicators (economic, demographic, other) this topic fits in the best</p>
            <p class="mt-4"><b>display</b> = how the numbers themselves will be displayed; largeNums for large numbers that are not money related (e.g. population), smallNums for small numbers that are not money related (e.g. fertility rate), largeNumsDollars for large numbers that are money related (e.g. GDP Nominal), smallNumsPercentages for small numbers that are money related or otherwise expressed in percentages (e.g. inflation, arable land (% of land area))</p>
            <p class="mt-4"><b>cannotOver100</b> = data that cannot have a value higher than 100 (e.g. internet users (% of population))</p>
            <p class="mt-4"><b>cannotBelow0</b> = data that cannot have a value smaller than 0 (e.g. population 0-14 (% of total))</p>
            <div class="flex justify-center mt-4">
                <DarkBtn @click="storeEditQuiz.instructions = false">Close</DarkBtn>
            </div>
        </div>
</template>