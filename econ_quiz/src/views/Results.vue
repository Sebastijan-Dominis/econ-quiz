<script setup>
// imports
import { useStoreAuth } from '../stores/storeAuth';
import CenterMessage from '../components/CenterMessage.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../js/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import PageTop from '../components/PageTop.vue';
import { useStoreFixedBtn } from '../stores/storeFixedBtn';
import DarkBtn from '../components/DarkBtn.vue';
import { useStoreQuiz } from '../stores/storeQuiz';

const storeAuth = useStoreAuth();
const storeFixedBtn = useStoreFixedBtn();
const storeQuiz = useStoreQuiz();

const results = ref([]);
const loading = ref(false);
const noMoreResults = ref(false);
const lastVisible = ref(null);
const pageSize = 10;

// sorting and filtering
const popupOpen = ref(false);
const openPopup = () => {
    popupOpen.value = true;
}
const sortByValue = ref("timestamp");
const sortDirection = ref("desc");
const filterTypeRef = ref(null);
const filterTopicRef = ref(null);

// disable the confirm button while fetching new data
const disableConfirm = ref(false);

const confirm = async() => {
    disableConfirm.value = true;
    popupOpen.value = false;
    results.value = [];
    lastVisible.value = null;
    noMoreResults.value = false;

    try {
        await fetchResults(sortDirection.value, sortByValue.value, filterTypeRef.value, filterTopicRef.value);
    } catch (error) {
        console.error(error);
        alert("Sorry. An error occurred.");
    } finally {
        disableConfirm.value = false;
    }
}

// main function to fetch results
const fetchResults = async(direction = "desc", element = "timestamp", filterType = null, filterTopic = null) => {
    if(loading.value || !storeAuth.user) return;
    loading.value = true;

    // creating a query
    const collectionRef = collection(db, "results");
    const conditions = [where("userID", "==", storeAuth.user.uid)];
    if(filterType) conditions.push(where("type", "==", filterType));
    if(filterTopic) conditions.push(where("topic", "==", filterTopic));
    let q = query(collectionRef, ...conditions, orderBy(element, direction), limit(pageSize));

    if(lastVisible.value) {
        q = query(q, startAfter(lastVisible.value));
    }
    try {
        const snapshot = await getDocs(q);
        if(!snapshot.empty) {
            snapshot.forEach(doc => {
                // Taken on (timestamp)
                const date = doc.data().timestamp.toDate();
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();
                const hours = date.getHours();
                let minutes = date.getMinutes();
                if(minutes <= 9) minutes = `0${minutes}`;
                const EUdate = `${day}.${month}.${year}. ${hours}:${minutes}`;

                // Time spent (timeTaken)
                const time = doc.data().timeTaken;
                let hoursSpent = null,
                    minutesSpent = null,
                    secondsSpent = null,
                    timeSpent;
                if(time >= 3600) {
                    hoursSpent = Math.floor(time/3600);
                    minutesSpent = Math.floor((time-hoursSpent)/60);
                    secondsSpent = time - (hoursSpent * 60) - (minutesSpent * 60);
                    timeSpent = `${hoursSpent}h ${minutesSpent}m ${secondsSpent}s`;
                } else if(time >= 60) {
                    minutesSpent = Math.floor(time/60);
                    secondsSpent = time - (minutesSpent * 60);
                    timeSpent = `${minutesSpent}m ${secondsSpent}s`;
                } else {
                    secondsSpent = time;
                    timeSpent = `${secondsSpent}s`;
                }

                // Difficulty
                const difficultyString = storeQuiz.difficultiesMapReverse[doc.data().difficulty];

                results.value.push({
                    score: doc.data().score,
                    timeTaken: timeSpent,
                    type: doc.data().type,
                    topic: doc.data().topic,
                    difficulty: difficultyString,
                    timestamp: EUdate
                });
            });

            lastVisible.value = snapshot.docs[snapshot.docs.length-1] || null;

            if(snapshot.size < pageSize) {
                noMoreResults.value = true;
            }
        }
    } catch(error) {
        console.error("Error fetching results: ", error);
    }

    loading.value = false;
};

const onScroll = (direction = "desc", element = "timestamp") => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    if(scrollPosition >= bottomPosition - 200 && !loading.value && !noMoreResults.value) {
        fetchResults(direction, element);
    }
};

const handleScroll = () => {
    onScroll(sortDirection.value, sortByValue.value);
}

onMounted(() => {
    fetchResults();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// fixed button
onMounted(() => {
    storeFixedBtn.isFixed = true;
})
onUnmounted(() => {
    storeFixedBtn.isFixed = false;
})
</script>

<template>
<CenterMessage v-if="!storeAuth.user">You are not logged in.<br>Please log in to view your results.</CenterMessage>
<div v-else>
    <PageTop>Results</PageTop>
        <div v-for="result in results" :key="result.id" class="w-[500px] h-auto px-8 py-4 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12">
            <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
                <h2>Type:</h2>
                <h2>{{ result.type }}</h2>
                <h2>Topic:</h2>
                <h2>{{ result.topic }}</h2>
                <h2>Difficulty:</h2>
                <h2>{{ result.difficulty }}</h2>
                <h2>Score:</h2>
                <h2>{{ result.score }}</h2>
                <h2>Time spent:</h2>
                <h2>{{ result.timeTaken }}</h2>
                <h2>Taken on:</h2>
                <h2>{{ result.timestamp }}</h2>
            </div> 
        </div>

        <DarkBtn class="fixed top-6 right-12" @click="openPopup" :class="{'disabled cursor-not-allowed': disableConfirm}">Sort and Filter</DarkBtn>
        <div v-show="popupOpen" class="fixed top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-full bg-bgpopup text-brand overflow-y-auto">

            <!-- sorter -->
            <h1 class="ml-32 pt-20 text-2xl font-bold">Sort by</h1>
            <div class="block">
                <input type="radio" id="sorter1" class="ml-40 mt-8" name="element" value="score" v-model="sortByValue">
                <label for="sorter1" class="ml-4">Score</label>
            </div>
            <div class="block">
                <input type="radio" id="sorter4" class="ml-40 mt-8" name="element" value="difficulty" v-model="sortByValue" >
                <label for="sorter4" class="ml-4">Difficulty</label>
            </div>
            <div class="block">
                <input type="radio" id="sorter2" class="ml-40 mt-8" name="element" value="timeTaken" v-model="sortByValue">
                <label for="sorter2" class="ml-4">Time Spent</label>
            </div>
            <div class="block">
                <input type="radio" id="sorter3" class="ml-40 mt-8" name="element" value="timestamp" v-model="sortByValue" checked>
                <label for="sorter3" class="ml-4">Taken on</label>
            </div>
            
            <h1 class="ml-32 pt-12 text-2xl font-bold">Order</h1>
            <div class="block">
                <input type="radio" id="direction1" class="ml-40 mt-8" name="direction" value="desc" v-model="sortDirection" checked>
                <label for="direction1" class="ml-4">Descending</label>
            </div>
            <div class="block">
                <input type="radio" id="direction2" class="ml-40 mt-8" name="direction" value="asc" v-model="sortDirection">
                <label for="direction2" class="ml-4">Ascending</label>
            </div>


            <!-- filter -->
            <div class="ml-32 py-20 lg:fixed lg:right-64 lg:top-0">
                <h1 class="text-2xl font-bold">Filter</h1>

                <!-- Types -->
                <p class="text-lg ml-8 mt-12 underline">Type</p>
                <div class="block">
                    <input type="radio" id="type1" class=" ml-8 mt-8" name="type" value="" v-model="filterTypeRef" checked>
                    <label for="type1" class="ml-4">All</label>
                </div>
                <div class="block">
                    <input type="radio" id="type2" class="ml-8 mt-8" name="type" value="Multiple Choice" v-model="filterTypeRef">
                    <label for="type2" class="ml-4">Multiple Choice</label>
                </div>

                <!-- Topics -->
                <p class="text-lg ml-8 mt-10 underline">Topic</p>
                <div class="block">
                    <input type="radio" id="topic1" class="ml-8 mt-8" name="topic" value="" v-model="filterTopicRef" checked>
                    <label for="topic1" class="ml-4">All</label>
                </div>

                <!-- Economic Indicators -->
                <div class="block">
                    <input type="radio" id="topic2" class="ml-8 mt-8" name="topic" value="Nominal GDP" v-model="filterTopicRef">
                    <label for="topic2" class="ml-4">Nominal GDP</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic3" class="ml-8 mt-8" name="topic" value="GDP PPP" v-model="filterTopicRef">
                    <label for="topic3" class="ml-4">GDP PPP</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic4" class="ml-8 mt-8" name="topic" value="Nominal GDP p/c" v-model="filterTopicRef">
                    <label for="topic4" class="ml-4">Nominal GDP p/c</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic5" class="ml-8 mt-8" name="topic" value="GDP PPP p/c" v-model="filterTopicRef">
                    <label for="topic5" class="ml-4">GDP PPP p/c</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic6" class="ml-8 mt-8" name="topic" value="Exports as % of GDP" v-model="filterTopicRef">
                    <label for="topic6" class="ml-4">Exports as % of GDP</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic7" class="ml-8 mt-8" name="topic" value="Imports as % of GDP" v-model="filterTopicRef">
                    <label for="topic7" class="ml-4">Imports as % of GDP</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic8" class="ml-8 mt-8" name="topic" value="Inflation" v-model="filterTopicRef">
                    <label for="topic8" class="ml-4">Inflation</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic9" class="ml-8 mt-8" name="topic" value="Unemployment" v-model="filterTopicRef">
                    <label for="topic9" class="ml-4">Unemployment</label>
                </div>

                <!-- Demographic Indicators -->
                <div class="block">
                    <input type="radio" id="topic10" class="ml-8 mt-8" name="topic" value="Total population" v-model="filterTopicRef">
                    <label for="topic10" class="ml-4">Total population</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic11" class="ml-8 mt-8" name="topic" value="Population growth rate" v-model="filterTopicRef">
                    <label for="topic11" class="ml-4">Population growth rate</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic12" class="ml-8 mt-8" name="topic" value="Population 65+ (% of total)" v-model="filterTopicRef">
                    <label for="topic12" class="ml-4">Population 65+ (% of total)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic13" class="ml-8 mt-8" name="topic" value="Population 0-14 (% of total)" v-model="filterTopicRef">
                    <label for="topic13" class="ml-4">Population 0-14 (% of total)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic14" class="ml-8 mt-8" name="topic" value="Urban population (% of total)" v-model="filterTopicRef">
                    <label for="topic14" class="ml-4">Urban population (% of total)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic15" class="ml-8 mt-8" name="topic" value="Fertility rate" v-model="filterTopicRef">
                    <label for="topic15" class="ml-4">Fertility rate</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic16" class="ml-8 mt-8" name="topic" value="Life expectancy" v-model="filterTopicRef">
                    <label for="topic16" class="ml-4">Life expectancy</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic17" class="ml-8 mt-8" name="topic" value="Net migration" v-model="filterTopicRef">
                    <label for="topic17" class="ml-4">Net migration</label>
                </div>

                <!-- Other Indicators -->
                <div class="block">
                    <input type="radio" id="topic18" class="ml-8 mt-8" name="topic" value="Literacy rate" v-model="filterTopicRef">
                    <label for="topic18" class="ml-4">Literacy rate</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic19" class="ml-8 mt-8" name="topic" value="Poverty headcount ratio" v-model="filterTopicRef">
                    <label for="topic19" class="ml-4">Poverty headcount ratio</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic20" class="ml-8 mt-8" name="topic" value="Health spending (% of GDP)" v-model="filterTopicRef">
                    <label for="topic20" class="ml-4">Health spending (% of GDP)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic21" class="ml-8 mt-8" name="topic" value="Arable land (% of land area)" v-model="filterTopicRef">
                    <label for="topic21" class="ml-4">Arable land (% of land area)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic22" class="ml-8 mt-8" name="topic" value="Forest area (% of land area)" v-model="filterTopicRef">
                    <label for="topic22" class="ml-4">Forest area (% of land area)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic23" class="ml-8 mt-8" name="topic" value="Diabetes as % of people ages 20 to 79" v-model="filterTopicRef">
                    <label for="topic23" class="ml-4">Diabetes as % of people ages 20 to 79</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic24" class="ml-8 mt-8" name="topic" value="Maternal mortality rate (per 100k births)" v-model="filterTopicRef">
                    <label for="topic24" class="ml-4">Maternal mortality rate (per 100k births)</label>
                </div>
                <div class="block">
                    <input type="radio" id="topic25" class="ml-8 mt-8" name="topic" value="Internet users (% of population)" v-model="filterTopicRef">
                    <label for="topic25" class="ml-4">Internet users (% of population)</label>
                </div>
            </div>

            <DarkBtn class="fixed bottom-6 right-12" @click="confirm">Confirm choices</DarkBtn>
        </div>
    </div>

    <p v-if="loading" class="flex justify-center pt-4 text-brand text-xl">Loading more results...</p>
</template>


<!-- provjeriti mogu li koristiti checkboxove u filteru na nacin da samo dodaje vrijednosti u neki array i onda trazi samo ono sta je u tom arrayju -->