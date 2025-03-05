<script setup>
// imports
import { useStoreAuth } from '../stores/storeAuth';
import CenterMessage from '../components/CenterMessage.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { db } from '../js/firebase';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import PageTop from '../components/PageTop.vue';

const storeAuth = useStoreAuth();

const results = ref([]);
const loading = ref(false);
const noMoreResults = ref(false);
const lastVisible = ref(null);
const pageSize = 10;

const fetchResults = async() => {
    if(loading.value) return;

    loading.value = true;

    let q = query(
        collection(db, "results"),
        orderBy("timestamp"),
        limit(pageSize)
    );

    if(lastVisible.value) {
        q = query(q, startAfter(lastVisible.value));
    }

    try {
        const snapshot = await getDocs(q);
        if(!snapshot.empty) {
            snapshot.forEach(doc => {
                console.log(doc)
                results.value.push({
                    score: doc.data().score,
                    timeTaken: doc.data().timeTaken,
                    type: doc.data().type,
                    topic: doc.data().topic,
                    difficulty: doc.data().difficulty,
                    // timestamp: doc.data().timestamp
                });
            });

            lastVisible.value = snapshot.docs[snapshot.docs.length-1];

            if(snapshot.size < pageSize) {
                noMoreResults.value = true;
            }
        }
    } catch(error) {
        console.error("Error fetching results: ", error);
    }

    loading.value = false;
};

const onScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    if(scrollPosition >= bottomPosition - 200 && !loading.value && !noMoreResults.value) {
        fetchResults();
    }
};

onMounted(() => {
    fetchResults();
    window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
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
            <h2>Time taken:</h2>
            <h2>{{ result.timeTaken }}</h2>
            <h2>Taken on:</h2>
            <h2>{{ result.timestamp }}</h2>
        </div> 
    </div>
</div>
</template>
















































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