<script setup>
// imports
import { useStoreQuiz } from '../stores/storeQuiz';
import { onBeforeUnmount, onMounted, onUnmounted, ref, watchEffect, computed } from 'vue';
import QuizBtn from '../components/QuizBtn.vue';
import NavBtn from '../components/NavBtn.vue';
import { useRouter } from 'vue-router';
import Popup from '../components/Popup.vue';
import { useStoreStudy } from '../stores/storeStudy';
import { useRoute } from 'vue-router';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../js/firebase';
import CenterMessage from '../components/CenterMessage.vue';
import { useStoreAuth } from '../stores/storeAuth';
import firstSound from '../assets/music/first.wav';
import secondSound from '../assets/music/second.wav';

// initializing pinia stores
const storeQuiz = useStoreQuiz();
const storeStudy = useStoreStudy();
const storeAuth = useStoreAuth();

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
const closePopups = event => {
    if(event.key === "Escape") {
        popupOpen.value = false;
        finishQ.value = false;
    }
}
onMounted(() => {
    document.addEventListener("keydown", closePopups);
})
onBeforeUnmount(() => {
    document.removeEventListener("keydown", closePopups);
})

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

// timed quizzes
const countdownNum = ref(null);
let countdownInterval = null;
if(route.params.type === "timed") {
    const countdown = function() {
        if(countdownInterval) clearInterval(countdownInterval);
        countdownNum.value = 5;
        countdownInterval = setInterval(() => {
            countdownNum.value--;
            if(countdownNum.value === 0) clearInterval(countdownInterval);
        }, 1000);
    };
    const questionTimer = ref(null);
    onMounted(() => {
        countdown();
        questionTimer.value = setInterval(() => {
            nextQ();
            countdown();
            if(curr.value === storeQuiz.questions.length-1) clearInterval(questionTimer.value);
        }, 5000)
    });
    onUnmounted(() => {
        if(questionTimer.value) clearInterval(questionTimer.value);
        if(countdownInterval) clearInterval(countdownInterval);
    });
    watchEffect(() => {
        if(curr.value === storeQuiz.questions.length-1) {
            setTimeout(() => {
                finish();
            }, 5000)
        }
    })

    // sound effects
    let firstInterval;
    let secondInterval;
    const first = ref(null);
    const second = ref(null);
    onMounted(() => {
        first.value = new Audio(firstSound);
        second.value = new Audio(secondSound); 
        first.value.play();
        second.value.play();
        firstInterval = setInterval(() => {
            first.value.play()
        }, 5000);
        secondInterval = setInterval(() => {
            second.value.play();
        }, 1000)
        setTimeout(() => {
            clearInterval(firstInterval);
            clearInterval(secondInterval);
            first.value = null;
            second.value = null;
        }, 100005)
    })
    onUnmounted(() => {
        clearInterval(firstInterval);
        clearInterval(secondInterval);
        first.value = null;
        second.value = null;
    })
}

// used for multiple choice and timed quizzes
const nextQ = () => {
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value]) storeQuiz.correctAnswers++;
    curr.value++;
}

//used for multiple choice quizzes
const prevQ = () => {
    if(curr.value > 1) curr.value--;
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value]) storeQuiz.correctAnswers--;
}

// manual input quizzes
const chosenNumber = ref(new Array(21).fill(0));

const formattedNumber = computed(() => {
    const num = chosenNumber.value[curr.value];
    if(typeof num === 'string') return "Invalid input.";
    if(storeStudy.smallNumsPercentages.has(originalValue)) {
        return `${num.toFixed(2)}%`;
    } else if(storeStudy.smallNums.has(originalValue)) {
        return num.toFixed(2);
    } else if(storeStudy.largeNumsDollars.has(originalValue)) {
        return `$${Number(num.toFixed(2)).toLocaleString()}`;
    } else if(storeStudy.largeNums.has(originalValue)) {
        return Number(num.toFixed(2)).toLocaleString();
    }
});

const nextQMan = () => {
    if(typeof chosenNumber.value[curr.value] === "string") {
        alert("Please input a valid number");
        return;
    }
    curr.value++;
}
const prevQMan = () => {
    if(curr.value > 1) curr.value--;
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
    if(storeQuiz.questions[curr.value].correct === usersChoice.value[curr.value] && storeQuiz.type !== "Manual Input") storeQuiz.correctAnswers++;
    document.removeEventListener('click', onClickOutside2);
    finishQ.value = false;
    done.value = true;
    if(!storeAuth.user) {
        savingFnDone.value = true;
        return;
    }
    try {
        const topic = storeStudy.reverseChoiceMap[route.params.choice];
        let score;
        if(storeQuiz.type !== "Manual Input") {
            score = (storeQuiz.correctAnswers/20)*100;
        } else {
            let closeness = [];
            for(let i = 1; i < chosenNumber.value.length; i++) {
                const currNum = chosenNumber.value[i];

                if(storeStudy.cannotOver100.has(topic) && currNum > 100 || storeStudy.cannotBelow0.has(topic) && currNum < 0 || topic === "Life expectancy" && currNum > 120) {
                    closeness.push(0.00);
                    continue;
                }

                const currCorr = storeQuiz.questions[i].correct;

                if(currNum === currCorr) {
                    closeness.push(100.00);
                    continue;
                }

                const limit = storeStudy.manualLimit;
                const distance = Math.abs(currCorr - currNum);
                
                if(distance >= limit) {
                    closeness.push(0.00);
                    continue;
                }

                const currCloseness = (100-((distance/limit)*100)).toFixed(2);
                closeness.push(currCloseness);
            }
            let total = 0;
            for(let i = 0; i < closeness.length; i++) {
                total += Number(closeness[i]);
            }
            score = (total/20).toFixed(2);
            storeQuiz.manualScore = score;
        }
        const resultsGlobalRef = collection(db, 'results');
        const difficulty = storeQuiz.difficultiesMap[route.params.difficulty];

        const typeFactor = storeQuiz.typeFactors[storeQuiz.type];
        const difficultyFactor = storeQuiz.difficultiesFactors[difficulty];
        let leaderboardScore = Math.floor(score * typeFactor * difficultyFactor);
        if(topic === "Life expectancy") {
            leaderboardScore = Math.floor(leaderboardScore * 0.65);
        }

        let indicator;
        if(storeStudy.economic.has(topic)) indicator = "economic";
        else if(storeStudy.demographic.has(topic)) indicator = "demographic";
        else if(storeStudy.other.has(topic)) indicator = "other";
        await addDoc(resultsGlobalRef, {
            username: storeAuth.user.displayName,
            score: score,
            timeTaken: Math.floor((end.value - start.value)/1000),
            type: storeQuiz.type,
            topic: topic,
            indicator: indicator,
            difficulty: difficulty,
            timestamp: Timestamp.fromDate(end.value),
            leaderboardScore: leaderboardScore
        })

        const resultsUserRef = collection(db, 'users', storeAuth.user.uid, 'results');
        await addDoc(resultsUserRef, {
            score: score,
            timeTaken: Math.floor((end.value - start.value)/1000),
            type: storeQuiz.type,
            topic: topic,
            indicator: indicator,
            difficulty: difficulty,
            timestamp: Timestamp.fromDate(end.value),
            leaderboardScore: leaderboardScore
        })
    } catch(error) {
        alert("Sorry. An error occurred and your results were not saved :/");
        console.error(error);
    } finally {
        savingFnDone.value = true;
    }
}

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside);
    document.removeEventListener('click', onClickOutside2);
    storeQuiz.questions = [];
    storeQuiz.correctAnswers = 0;
})
</script>

<template>
    <!-- quiz flow -->
    <div v-if="!done && !storeQuiz.error">
        <h1 class="pt-8 text-brand text-base font-bold flex text-center justify-center md:pt-10 md:text-3xl lg:pt-12 lg:text-4xl 2xl:text-5xl mx-4 questionTitle">{{ storeQuiz.questions[curr].question }}</h1>

        <!-- display questions for multiple choice and timed quizzes -->
        <div v-if="storeQuiz.type !== 'Manual Input'" class="grid grid-cols-1 gap-y-8 mt-12 md:grid-cols-2 md:gap-y-28 md:mt-24 place-items-center options">
        <QuizBtn v-for="option in [storeQuiz.questions[curr].options[0], storeQuiz.questions[curr].options[1], storeQuiz.questions[curr].options[2], storeQuiz.questions[curr].options[3]]"
        :key="option"
        :class="usersChoice[curr] === option ? 'chosenAnswer' : ''"
        @mousedown="chooseAnswer(option)">
            <div v-if="storeStudy.largeNumsDollars.has(originalValue)">
                <span>${{ option.toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNumsPercentages.has(originalValue)">
                <span>{{ option }}%</span>
            </div>
            <div v-if="storeStudy.largeNums.has(originalValue)">
                <span>{{ option.toLocaleString() }}</span>
            </div>
            <div v-if="storeStudy.smallNums.has(originalValue)">
                <span>{{ option }}</span>
            </div>
        </QuizBtn>
        </div>

        <!-- manual input quizzes -->
        <div v-if="storeQuiz.type === 'Manual Input'" class="mt-12 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 flex flex-col items-center">
            <h2 class="manualNumber">
                <span>{{ formattedNumber }}</span>
            </h2>
            <input type="number" v-model="chosenNumber[curr]" class="p-2 mt-8 text-lg md:mt-12 md:p-3 md:text-xl lg:mt-16 lg:p-4 lg:text-2xl xl:mt-24 xl:p-6 xl:text-3xl 2xl:mt-32 2xl:p-8 2xl:text-4xl font-bold border border-brand border-2 2xl:border-4 rounded-full text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance:textfield] manualInputField">
        </div>

        <!-- options for manual input quizzes -->
        <div v-if="storeQuiz.type === 'Manual Input'" class="grid grid-cols-2 place-items-center mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-32 mx-2 md:mx-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="{'disabled active:scale-[1] disableBtn': curr === 1}" @click="prevQMan" custom-class="manualNav">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQMan" custom-class="manualNav">Next</NavBtn>
            <NavBtn v-else @click="openFinish" custom-class="manualNav">Finish</NavBtn>
        </div>

        <!-- options for multiple choice quizzes -->
        <div v-if="storeQuiz.type === 'Multiple Choice'" class="grid grid-cols-2 place-items-center mt-10 mx-2 md:mx-16 md:mt-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="{'disabled active:scale-[1] disableBtn': curr === 1}" @click="prevQ">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQ">Next</NavBtn>
            <NavBtn v-else @click="openFinish">Finish</NavBtn>
        </div>

        <!-- enabling the user to quit at any point -->
        <div class="flex justify-center mt-10">
            <button @click="openPopup" class="w-16 h-10 bg-bgbtn text-wg border border-2 border-brand rounded-lg md:w-20 md:h-12 lg:w-28 lg:h-14 2xl:mt-16 lg:hover:bg-brand lg:hover:text-bg lg:active:scale-[0.98] max-md:text-sm quitBtn">Quit</button>
        </div>

        <!-- double checking if the user really wants to quit -->
        <div v-if="popupOpen">
            <Popup ref="dialog" @confirm="quitYes" @decline="quitNo">Are you sure you want to quit?</Popup>
        </div>
        <div class="fixed bottom-4 max-xl:left-[50%] max-xl:translate-x-[-50%] text-brand font-bold md:bottom-12 md:text-2xl lg:bottom-20 lg:text-3xl xl:top-14 xl:right-12">
            {{curr}}/20
        </div>    
    </div>


    <!-- countdown -->
    <div v-if="storeQuiz.type === 'Timed' && !done" class="square hithere fixed top-8 right-12">{{ countdownNum }}</div>

    <!-- finish? -->
    <div v-if="finishQ">
        <Popup ref="dialog" @confirm="finish" @decline="quitNo">Are you sure you want to finish?</Popup>
    </div>

    <!-- waiting to see if the results will be saved properly -->
    <CenterMessage v-if="done && storeQuiz && !savingFnDone">Loading your results...</CenterMessage>

    <!-- display results for multiple choice and timed quizzes -->
    <div v-if="done && !storeQuiz.error && savingFnDone && storeQuiz.type !== 'Manual Input'" class="flex flex-col h-[100vh] text-center items-center justify-evenly px-12 lg:px-24">
            <h1 class="text-xl md:text-2xl lg:text-3xl text-brand font-bold 2xl:text-4xl">You have answered {{ storeQuiz.correctAnswers }} out of {{ storeQuiz.questions.length-1 }} questions correctly!</h1>
            <p class="text-brand text-sm md:text-base lg:text-xl 2xl:text-2xl mt-8 2xl:mt-12">You can check real values in the Study section</p>
        <NavBtn @click="router.push('/')">Ok</NavBtn>
    </div>
    
    <!-- display results for manual input quizzes -->
    <div v-if="done && !storeQuiz.error && savingFnDone && storeQuiz.type === 'Manual Input'" class="flex flex-col text-center items-center justify-center pt-12 px-24 2xl:pt-20">
        <h1 class="text-2xl text-brand font-bold 2xl:text-3xl">Your score is: {{ storeQuiz.manualScore }}% !</h1>
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

@media (max-width: 640px) and (min-height: 840px) {
    .options {
        row-gap: 3.5rem;
        margin-bottom: 6rem;
    }
}

@media (min-width: 1024px) and (max-height: 700px) {
    .options {
        padding-left: 3rem;
        padding-right: 3rem;
        margin-top: 3rem;
        row-gap: 3.5rem;
    }
    .questionTitle {
        padding-top: 2.5rem;
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    .quitBtn {
        width: 5rem;
        height: 3rem;
    }
}

@media (min-width: 1024px) and (min-height: 701px) and (max-height: 800px) {
    .options {
        padding-left: 3rem;
        padding-right: 3rem;
    }
    .quitBtn {
        width: 5rem;
        height: 3rem;
    }
    .questionTitle {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
}

@media (min-width: 1280px) and (min-height: 801px) and (max-height: 940px) {
    .quitBtn {
        margin-top: 0rem;
    }
    .questionTitle {
        padding-top: 3rem;
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
}

.square {
    display: inline-block;
    width: 70px;
    height: 70px;
    border-radius: 20px;
    background: rgba(255, 165, 80, 0.9);
    box-shadow: 4px -40px 60px 5px rgba(0, 0, 0, 0.8) inset;
    text-align: center;
    place-content: center;
    font-size: 24px;
    color: var(--wg);
    font-weight: 700;
}
@media (max-width: 640px) {
    .square {
        background: transparent;
        box-shadow: none;
    }
}
.hithere {
    animation: hithere 1s ease infinite;
}
@keyframes hithere {
    30% { transform: scale(1.2); }
    40%, 60% { transform: rotate(-20deg) scale(1.2); }
    50% { transform: rotate(20deg) scale(1.2); }
    70% { transform: rotate(0deg) scale(1.2); }
    100% { transform: scale(1); }
}

.manualNumber {
    color: var(--brand);
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75rem;
    grid-column: span 2;
}
.manualTitle {
    color: var(--brand);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 700;
}
.manualButton {
    color: var(--wg);
    background-color: var(--bgbtn);
    font-size: 1.125rem;
    line-height: 1.75rem;
    border: 2px solid var(--brand);
    border-radius: 8px;
    height: 3rem;
    width: 7rem;
}
@media (min-width: 1024px) {
    .manualButton:hover {
        background-color: var(--brand);
        color: var(--bg);
    }
    .manualButton:active {
        scale: 0.98;
    }
}
@media(min-width: 768px) {
    .manualNumber {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    .manualTitle {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
    .manualButton {
        width: 8.5rem;
        height: 3.5rem;
        font-size: 1.5rem;
        line-height: 2rem;
    }
}
@media(min-width: 1280px) {
    .manualNumber {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
    .manualTitle {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    .manualButton {
        width: 12rem;
        height: 5rem;
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
}
@media(min-width: 1536px) {
    .manualNumber {
        font-size: 3rem;
        line-height: 1;
    }
    .manualTitle {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
    .manualButton {
        width: 14rem;
        height: 6rem;
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
}

.instructions {
    font-size: 1.25rem;
    line-height: 1.75rem;
}

@media (min-width: 1280px) {
    .manualNav {
        font-size: 1.25rem;
        line-height: 1.75rem;
        height: 5rem;
        width: 12rem;
    }
}
@media(min-width: 1536px) {
    .manualNav {
        font-size: 1.5rem;
        line-height: 2rem;
        height: 6rem;
        width: 14rem;
    }
}
</style>