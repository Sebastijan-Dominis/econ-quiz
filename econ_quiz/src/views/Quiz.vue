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
import DarkBtn from '../components/DarkBtn.vue';
import InstructionsBtn from '../components/InstructionsBtn.vue';
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
const number = ref(new Array(21).fill(0));
const keyModifier = ref(1);
const shiftPressed = ref(false);

const formattedNumber = computed(() => {
    if(storeStudy.smallNumsPercentages.has(originalValue)) {
        return `${number.value[curr.value].toFixed(2)}%`;
    } else if(storeStudy.smallNums.has(originalValue)) {
        return number.value[curr.value].toFixed(2);
    } else if(storeStudy.largeNumsDollars.has(originalValue)) {
        return `$${Number(number.value[curr.value].toFixed(2)).toLocaleString()}`;
    } else if(storeStudy.largeNums.has(originalValue)) {
        return Number(number.value[curr.value].toFixed(2)).toLocaleString();
    }
    return '';
});

const modifyWholeNumber = amount => {
    number.value[curr.value] += amount * keyModifier.value;
};

const modifyDecimal = amount => {
    const step = shiftPressed.value ? 0.10 : 0.01;
    number.value[curr.value] = parseFloat((number.value[curr.value] + amount * step).toFixed(2));
};

const handleKeydown = event => {
    if(event.key.match(/[1-9]/)) {
        keyModifier.value = Math.pow(10, parseInt(event.key))
    } else {
        switch (event.key) {
            case "0":
                keyModifier.value = 10000000000
                break;
            case "Q":
            case "q":
                keyModifier.value = 100000000000;
                break;
            case "W":
            case "w":
                keyModifier.value = 1000000000000;
                break;
            case "E":
            case "e":
                keyModifier.value = 10000000000000;
                break;
            case "R":
            case "r":
                keyModifier.value = 100000000000000;
                break;
            case "T":
            case "t":
                keyModifier.value = 1000000000000000;
                break;
            default:
                break;
        }
    }
    if(event.shiftKey) {
        shiftPressed.value = true;
    }
};

const handleKeyup = () => {
    keyModifier.value = 1;
    shiftPressed.value = false;
};

if(route.params.type === "manual-input") {
    onMounted(() => {
        window.addEventListener("keydown", handleKeydown);
        window.addEventListener("keyup", handleKeyup);
    });
    onUnmounted(() => {
        window.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("keyup", handleKeyup);
    });
};

const nextQMan = () => {
    curr.value++;
}
const prevQMan = () => {
    if(curr.value > 1) curr.value--;
}

// instructions for manual input quizzes
const instructions = ref(false);

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
            for(let i = 1; i < number.value.length; i++) {
                const currNum = number.value[i];

                if(storeStudy.cannotOver100.has(topic) && currNum > 100 || storeStudy.cannotBelow0.has(topic) && currNum < 0) {
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
        const leaderboardScore = Math.floor(score * typeFactor * difficultyFactor);

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
        <h1 class="pt-8 text-brand text-base font-bold flex text-center justify-center md:text-xl md:pt-10 md:text-3xl lg:pt-12 xl:text-4xl 2xl:text-5xl">{{ storeQuiz.questions[curr].question }}</h1>

        <!-- display questions for multiple choice and timed quizzes -->
        <div v-if="storeQuiz.type !== 'Manual Input'" class="grid grid-cols-1 gap-y-12 mt-16 md:grid-cols-2 md:gap-y-28 md:mt-24 md:px-12 lg:px-20 2xl:px-36 place-items-center">
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
        <div v-if="storeQuiz.type === 'Manual Input'" class="mt-12 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 grid grid-cols-2 gap-y-6 place-items-center md:gap-y-10">
            <h2 class="manualNumber">
              <span>{{ formattedNumber }}</span>
            </h2>
            <h3 class="manualTitle">Whole</h3>
            <h3 class="manualTitle">Decimal</h3>
            <button @click="modifyWholeNumber(1)" class="manualButton">+</button>
            <button @click="modifyDecimal(1)" class="manualButton">+</button>
            <button @click="modifyWholeNumber(-1)" class="manualButton">-</button>
            <button @click="modifyDecimal(-1)" class="manualButton">-</button>
        </div>

        <!-- options for manual input quizzes -->
        <div v-if="storeQuiz.type === 'Manual Input'" class="grid grid-cols-2 place-items-center mt-10 mx-40 md:mx-16 md:mt-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="curr === 1 ? 'disabled active:scale-[1] disableBtn' : ''" @click="prevQMan">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQMan">Next</NavBtn>
            <NavBtn v-else @click="openFinish">Finish</NavBtn>
        </div>

        <!-- instructions for manual input quizzes -->
        <InstructionsBtn v-show="storeQuiz.type === 'Manual Input'" @click="instructions = true"></InstructionsBtn>
        
        <div v-show="instructions">
            <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
            <div class="fixed top-0 left-0 w-full h-[70%] grid grid-cols-2 text-brand place-items-center items-start mt-16">
                <h1 class="col-span-2 text-3xl font-bold">Instructions</h1>
                <p class="col-span-2 text-2xl">Hold these keys while clicking</p>
                <p class="col-span-2 text-1xl">(e.g. hold 2 while clicking on whole + or - to increase or decrease it by 100)</p>
                <div>
                    <h2 class="text-2xl font-bold">Whole</h2>
                    <div class="mt-4">
                        <p class="instructions">default => +-1</p>
                        <p class="instructions">1 => +-10</p>
                        <p class="instructions">2 => +-100</p>
                        <p class="instructions">3 => +-1,000</p>
                        <p class="instructions">4 => +-10,000</p>
                        <p class="instructions">5 => +-100,000</p>
                        <p class="instructions">6 => +-1,000,000</p>
                        <p class="instructions">7 => +-10,000,000</p>
                        <p class="instructions">8 => +-100,000,000</p>
                        <p class="instructions">9 => +-1,000,000,000</p>
                        <p class="instructions">0 => +-10,000,000,000</p>
                        <p class="instructions">q => +-100,000,000,000</p>
                        <p class="instructions">w => +-1,000,000,000,000</p>
                        <p class="instructions">e => +-10,000,000,000,000</p>
                        <p class="instructions">r => +-100,000,000,000,000</p>
                        <p class="instructions">t => +-1,000,000,000,000,000</p>
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold">Decimal</h2>
                    <div class="mt-4">
                        <p class="instructions">default => +-0.01</p>
                        <p class="instructions">shift => +=0.1</p>
                    </div>
                </div>
                <DarkBtn @click="instructions = false" class="col-span-2">Close</DarkBtn>
            </div>
        </div>


        <!-- options for multiple choice quizzes -->
        <div v-if="storeQuiz.type === 'Multiple Choice'" class="grid grid-cols-2 place-items-center mt-10 mx-40 md:mx-16 md:mt-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="curr === 1 ? 'disabled active:scale-[1] disableBtn' : ''" @click="prevQ">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQ">Next</NavBtn>
            <NavBtn v-else @click="openFinish">Finish</NavBtn>
        </div>

        <!-- enabling the user to quit at any point -->
        <div class="flex justify-center mt-10">
            <button @click="openPopup" class="w-16 h-10 bg-bgbtn text-wg border border-2 border-brand rounded-lg md:w-20 md:h-12 lg:w-28 lg:h-14 2xl:mt-16 hover:bg-brand hover:text-bg active:scale-[0.98] max-md:text-sm">Quit</button>
        </div>

        <!-- double checking if the user really wants to quit -->
        <div v-if="popupOpen">
            <Popup ref="dialog" @confirm="quitYes" @decline="quitNo">Are you sure you want to quit?</Popup>
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
    <div v-if="done && !storeQuiz.error && savingFnDone && storeQuiz.type !== 'Manual Input'" class="flex flex-col text-center items-center justify-center pt-12 px-24 2xl:pt-20">
        <h1 class="text-2xl text-brand font-bold 2xl:text-3xl">You have answered {{ storeQuiz.correctAnswers }} out of {{ storeQuiz.questions.length-1 }} questions correctly!</h1>
        <NavBtn @click="router.push('/')" :class="'mt-24 2xl:mt-32'">Ok</NavBtn>
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
.manualButton:hover {
    background-color: var(--brand);
    color: var(--bg);
}
.manualButton:active {
    scale: 0.98;
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
</style>