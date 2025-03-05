<script setup>
// imports
import { useStoreQuiz } from '../stores/storeQuiz';
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import QuizBtn from '../components/QuizBtn.vue';
import NavBtn from '../components/NavBtn.vue';
import { useRouter } from 'vue-router';
import Popup from '../components/Popup.vue';
import { useStoreStudy } from '../stores/storeStudy';
import { useRoute } from 'vue-router';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../js/firebase';
import CenterMessage from '../components/CenterMessage.vue';

// initializing pinia stores
const storeQuiz = useStoreQuiz();
const storeStudy = useStoreStudy();

// initializing route and getting the choice
const route = useRoute();
const originalValue  = storeStudy.reverseChoiceMap[route.params.choice];

// managing the popup
const popupOpen = ref(false);
const finishQ = ref(false);
const confirmation = ref(null);
const dialog = ref(null);
const router = useRouter();
watchEffect(() => {
    if(dialog.value) {
        confirmation.value = dialog.value.confirmation;
    }
})
const onClickOutside = () => {
    document.removeEventListener('mousedown', onClickOutside);
    document.addEventListener('click', onClickOutside2);
}
const onClickOutside2 = event => {
    if(confirmation.value && !confirmation.value.contains(event.target)) {
        popupOpen.value = false;    
        finishQ.value = false;
        document.removeEventListener('click', onClickOutside2);
    }
}
const openPopup = () => {
    popupOpen.value = true;
    document.addEventListener('mousedown', onClickOutside);
}
const quitYes = () => {
    router.push('/');
}
const quitNo = () => {
    document.removeEventListener('click', onClickOutside2);
    popupOpen.value = false;
    finishQ.value = false;
}

// managing the quiz flow
const start = ref(null);
const end = ref(null);
onMounted(() => {
    start.value = new Date();
})

const curr = ref(1);
const usersChoice = ref(new Array(storeQuiz.questions));
const chooseAnswer = function(option) {
    usersChoice.value[curr.value] = option;
}
const nextQ = () => {
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value]) storeQuiz.correctAnswers++;
    curr.value++;
}
const prevQ = () => {
    if(curr.value > 1) curr.value--;
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value]) storeQuiz.correctAnswers--;
}

// finishing
const done = ref(false);
const openFinish = () => {
    finishQ.value = true;
    document.addEventListener('mousedown', onClickOutside);
}
const savingFnDone = ref(false);
const finish = async() => {
    end.value = new Date();
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value]) storeQuiz.correctAnswers++;
    document.removeEventListener('click', onClickOutside2);
    finishQ.value = false;
    done.value = true;
    try {
        const topic = storeStudy.reverseChoiceMap[route.params.choice];
        const resultsRef = collection(db, 'results');
        await addDoc(resultsRef, {
            score: storeQuiz.correctAnswers,
            timeTaken: Math.floor((end.value - start.value)/1000),
            type: "Multiple Choice",
            topic: topic,
            difficulty: route.params.difficulty,
            timestamp: Timestamp.fromDate(end.value)
        })
    } catch(error) {
        alert("Sorry. An error occurred and your results were not saved :/");
        console.error(error);
    } finally {
        savingFnDone.value = true;
    }
}
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside2);
    storeQuiz.questions = [];
    storeQuiz.correctAnswers = 0;
})
</script>

<template>
    <!-- quiz flow -->
    <div v-if="!done && !storeQuiz.error">
        <h1 class="pt-8 text-brand text-base font-bold flex text-center justify-center md:text-xl md:pt-10 md:text-3xl lg:pt-12 xl:text-4xl 2xl:text-5xl">{{ storeQuiz.questions[curr].question }}</h1>
        <div class="grid grid-cols-1 gap-y-12 mt-16 md:grid-cols-2 md:gap-y-28 md:mt-24 md:px-12 lg:px-20 2xl:px-36 place-items-center">
        <QuizBtn v-for="option in [storeQuiz.questions[curr].options[0], storeQuiz.questions[curr].options[1], storeQuiz.questions[curr].options[2], storeQuiz.questions[curr].options[3]]"
        :key="option"
        :class="usersChoice[curr] === option ? 'chosenAnswer' : ''"
        @click="chooseAnswer(option)">
            <div v-if="storeStudy.largeNumsDollars.has(originalValue)">
              <span>${{ Math.round(option).toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNumsPercentages.has(originalValue)">
              <span>{{ option }}%</span>
            </div>
            <div v-if="storeStudy.largeNums.has(originalValue)">
              <span>{{ Math.round(option).toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNums.has(originalValue)">
              <span>{{ option }}</span>
            </div>
        </QuizBtn>
        </div>
        <div class="grid grid-cols-2 place-items-center mt-10 mx-40 md:mx-16 md:mt-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="curr === 1 ? 'disabled active:scale-[1] disableBtn' : ''" @click="prevQ">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQ">Next</NavBtn>
            <NavBtn v-else @click="openFinish">Finish</NavBtn>
        </div>
        <div class="flex justify-center mt-10">
            <button @click="openPopup" class="w-14 h-8 bg-bgbtn text-wg border border-2 border-brand rounded-lg md:w-20 md:h-12 lg:w-28 lg:h-14 2xl:mt-16 hover:bg-brand hover:text-bg active:scale-[0.98]">Quit</button>
        </div>
        <div v-show="popupOpen">
            <Popup ref="dialog" @confirm="quitYes" @decline="quitNo" customClass="mt-2 max-md:mt-4">Are you sure you want to quit?</Popup>
        </div>
    </div>

    <!-- finish? -->
    <div v-show="finishQ">
        <Popup ref="dialog" @confirm="finish" @decline="quitNo" customClass="mt-2 max-md:mt-4">Are you sure you want to finish?</Popup>
    </div>

    <!-- waiting to see if the results will be saved properly -->
    <CenterMessage v-if="done && storeQuiz && !savingFnDone">Loading your results...</CenterMessage>

    <!-- display results -->
    <div v-if="done && !storeQuiz.error && savingFnDone" class="flex flex-col text-center items-center justify-center pt-12 px-24 2xl:pt-20">
    <h1 class="text-2xl text-brand font-bold 2xl:text-3xl">You have answered {{ storeQuiz.correctAnswers }} out of {{ storeQuiz.questions.length-1 }} questions correctly!</h1>
    <NavBtn @click="router.push('/')" :class="'mt-24 2xl:mt-32'">Ok</NavBtn>
    </div>

    <!-- error handling -->
     <CenterMessage v-if="storeQuiz.error">{{ storeQuiz.error }}</CenterMessage>
</template>

<style scoped>
.chosenAnswer {
    background-color: var(--brand);
    color: var(--bg);
}

.disableBtn {
    border-color: var(--bg);
    color: var(--bg);
}
.disableBtn:hover {
    background-color: var(--bgbtn);
    color: var(--bg);
    cursor: not-allowed;
}
</style>