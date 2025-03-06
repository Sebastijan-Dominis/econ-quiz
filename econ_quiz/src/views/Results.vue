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
const sortByValue = ref("timeTaken");
const sortDirection = ref("desc");

// disable the confirm button while fetching new data
const disableConfirm = ref(false);

const confirm = async() => {
    disableConfirm.value = true;
    popupOpen.value = false;
    results.value = [];
    lastVisible.value = null;
    noMoreResults.value = false;

    try {
        await fetchResults(sortDirection.value, sortByValue.value);
    } catch (error) {
        console.error(error);
        alert("Sorry. An error occurred.");
    } finally {
        disableConfirm.value = false;
    }
}

// main function to fetch results
const fetchResults = async(direction = "desc", element = "timestamp") => {
    if(loading.value || !storeAuth.user) return;

    loading.value = true;

    let q = query(
        collection(db, "results"),
        where("userID", "==", storeAuth.user.uid),
        orderBy(element, direction),
        limit(pageSize)
    );

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
        <div v-show="popupOpen" class="fixed top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-full bg-bgpopup text-brand">
            <h1 class="ml-32 pt-20 text-2xl font-bold">Sort by</h1>
            <div class="block">
                <input type="radio" id="sorter1" class="ml-40 mt-8" name="element" value="score" v-model="sortByValue">
                <label for="sorter1" class="ml-4">Score</label>
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

            <DarkBtn class="fixed bottom-6 right-12" @click="confirm">Confirm choices</DarkBtn>
        </div>
    </div>

    <p v-if="loading" class="flex justify-center pt-4 text-brand text-xl">Loading more results...</p>
</template>

<!-- figure out how to query complex queries -->











































<!-- <script setup>
// imports
import PageTop from '../components/PageTop.vue';
import ReturnBtn from '../components/ReturnBtn.vue';
import { ref } from 'vue';

// titles
const titles = ref(['Quiz Name', 'Difficulty', 'Result']);
</script> -->

<!-- <template> -->
    
<!-- Desktop -->
<!-- <div class="max-lg:hidden">
    <PageTop>Results</PageTop>
    <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Results: Category Name</h2>
</div>

<div class="grid grid-cols-3 mx-32 gap-12 max-lg:hidden">
    <div v-for="(title, index) in titles" :key="index" class="flex flex-col items-center mt-12">
      <h2 class="text-3xl text-brand font-bold text-center">{{ title }}</h2>
  </div>
</div> -->

<!-- Mobile -->
 <!-- <div class="lg:hidden">
     <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
     <h1 class="text-brand text-6xl justify-self-center max-lg:text-5xl max-md:text-4xl max-md:w-64 text-center">Results</h1>
     <ReturnBtn class="fixed bottom-12 left-4"></ReturnBtn>
     <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Results: Category Name</h2>
 </div>

<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
</template> -->