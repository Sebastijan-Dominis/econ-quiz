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
import { useStoreStudy } from '../stores/storeStudy';

const storeAuth = useStoreAuth();
const storeFixedBtn = useStoreFixedBtn();
const storeQuiz = useStoreQuiz();
const storeStudy = useStoreStudy();

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
const types = ref([...storeStudy.allTypes]);
const indicators = ref([...storeStudy.indicators]);

const updateSelectedTypes = (type, event) => {
    if(event.target.checked) {
        types.value.push(type);
    } else {
        types.value = types.value.filter(t => t !== type);
    }
}

const updateSelectedIndicators = (indicator, event) => {
    if(event.target.checked) {
        indicators.value.push(indicator);
    } else {
        indicators.value = indicators.value.filter(i => i !== indicator);
    }
}


// disable the confirm button while fetching new data
const disableConfirm = ref(false);

const confirm = async() => {
    disableConfirm.value = true;
    popupOpen.value = false;
    results.value = [];
    lastVisible.value = null;
    noMoreResults.value = false;

    try {
        await fetchResults(sortDirection.value, sortByValue.value, types, indicators);
    } catch (error) {
        console.error(error);
        alert("Sorry. An error occurred.");
    } finally {
        disableConfirm.value = false;
    }
}

// main function to fetch results
const fetchResults = async(direction = "desc", element = "timestamp", types = undefined, indicators = undefined) => {
    if(loading.value || !storeAuth.user) return;
    loading.value = true;
    // creating a query
    const collectionRef = collection(db, "users", storeAuth.user.uid, 'results');
    const conditions = [];
    if(types !== undefined && types.value.length) {
        conditions.push(where("type", "in", types.value));
    }
    if(indicators !== undefined && indicators.value.length) {
        conditions.push(where("indicator", "in", indicators.value));
    }
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
                    difficulty: difficultyString,
                    topic: doc.data().topic,
                    indicator: doc.data().indicator,
                    leaderboardScore: doc.data().leaderboardScore,
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

// pagination to handle lots of results
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
<PageTop>Results</PageTop>
<CenterMessage v-if="!storeAuth.user">You are not logged in.<br>Please log in to view your results.</CenterMessage>
<div v-else>
    <div v-for="result in results" :key="result.id" class="w-[500px] h-auto px-8 py-4 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12">
        <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
            <h2>Type:</h2>
            <h2>{{ result.type }}</h2>
            <h2>Topic:</h2>
            <h2>{{ result.topic }}</h2>
            <h2>Difficulty:</h2>
            <h2>{{ result.difficulty }}</h2>
            <h2>Score:</h2>
            <h2>{{ result.score }}%</h2>
            <h2>Time spent:</h2>
            <h2>{{ result.timeTaken }}</h2>
            <h2>Leaderboard score:</h2>
            <h2>{{ result.leaderboardScore }}</h2>
            <h2>Taken on:</h2>
            <h2>{{ result.timestamp }}</h2>
        </div> 
    </div>

    <DarkBtn class="fixed top-6 right-12" @click="openPopup" :class="{'disabled cursor-not-allowed': disableConfirm}">Sort and Filter</DarkBtn>
    <div v-show="popupOpen" class="fixed top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-full bg-bgpopup text-brand overflow-y-auto">

        <!-- sorter -->
        <h1 class="sorterTitle pt-20">Sort by</h1>
        <div class="block">
            <input type="radio" id="sorter1" class="sorterInput" name="element" value="score" v-model="sortByValue">
            <label for="sorter1" class="sorterLabel">Score</label>
        </div>
        <div class="block">
            <input type="radio" id="sorter4" class="sorterInput" name="element" value="difficulty" v-model="sortByValue" >
            <label for="sorter4" class="sorterLabel">Difficulty</label>
        </div>
        <div class="block">
            <input type="radio" id="sorter2" class="sorterInput" name="element" value="timeTaken" v-model="sortByValue">
            <label for="sorter2" class="sorterLabel">Time Spent</label>
        </div>
        <div class="block">
            <input type="radio" id="sorter3" class="sorterInput" name="element" value="timestamp" v-model="sortByValue" checked>
            <label for="sorter3" class="sorterLabel">Taken on</label>
        </div>
        
        <h1 class="sorterTitle pt-12">Order</h1>
        <div class="block">
            <input type="radio" id="direction1" class="sorterInput" name="direction" value="desc" v-model="sortDirection" checked>
            <label for="direction1" class="sorterLabel">Descending</label>
        </div>
        <div class="block">
            <input type="radio" id="direction2" class="sorterInput" name="direction" value="asc" v-model="sortDirection">
            <label for="direction2" class="sorterLabel">Ascending</label>
        </div>


        <!-- filter -->
        <div class="ml-32 py-20 lg:fixed lg:right-64 lg:top-0">
            <h1 class="text-2xl font-bold">Filter</h1>

            <!-- Types -->
            <p class="filterTitle mt-12">Type</p>
            <label v-for="type in storeStudy.allTypes" :key="type" class="filterLabel">
                <input type="checkbox" :value ="type" checked @change="updateSelectedTypes(type, $event)">
                {{ type }}
            </label>

            <!-- Indicators -->
            <p class="filterTitle mt-10">Indicator</p>
            <label v-for="indicator in storeStudy.indicators" :key="indicator" class="filterLabel">
                <input type="checkbox" :value="indicator" checked @change="updateSelectedIndicators(indicator, $event)">
                {{ indicator }}
            </label>
        </div>

        <DarkBtn class="fixed bottom-6 right-12" @click="confirm">Confirm choices</DarkBtn>
    </div>
</div>

<p v-if="loading" class="flex justify-center pt-4 text-brand text-xl">Loading more results...</p>
</template>

<style scoped>
.filterTitle {
    font-size: 18px;
    margin-left: 2rem;
    text-decoration: underline;
}
.filterLabel {
    display: block;
    margin-top: 0.5rem;
    cursor: pointer;
}

.sorterTitle {
    margin-left: 128px;
    font-size: 24px;
    font-weight: 700;
}
.sorterInput {
    margin-left: 10rem;
    margin-top: 2rem;
}
.sorterLabel {
    margin-left: 1rem;
}
.sorterLabel, .sorterInput {
    cursor: pointer;
}
</style>