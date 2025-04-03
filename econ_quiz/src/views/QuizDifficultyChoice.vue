<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import DarkBtn from '../components/DarkBtn.vue';
import { reactive, ref, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import Popup from '../components/Popup.vue';
import { useStoreQuiz } from '../stores/storeQuiz';
import CenterMessage from '../components/CenterMessage.vue';

// route
const route = useRoute();

// defining the title
const storeStudy = useStoreStudy();

// managing images display
const difficulties = reactive({
    noob: false,
    veryEasy: false,
    easy: false,
    normal: false,
    hard: false,
    veryHard: false,
    absoluteMadman: false,
})

// popup
const confirmation = ref(null);
const dialog = ref(null);
watchEffect(() => {
    if(dialog.value) {
        confirmation.value = dialog.value.confirmation;
    }
})
const onClickOutside = event => {
    document.removeEventListener('mousedown', onClickOutside);
    document.addEventListener('click', onClickOutside2);
}
const onClickOutside2 = event => {
    if(confirmation.value && !confirmation.value.contains(event.target)) {
        showPopup.value = false;    
        document.removeEventListener('click', onClickOutside2);
    }
}
const closePopups = event => {
    if(event.key === "Escape") {
        showPopup.value = false;
    }
}
onMounted(() => {
    document.addEventListener("keydown", closePopups);
})
onBeforeUnmount(() => {
    document.removeEventListener("keydown", closePopups);
})

// starting the quiz
const router = useRouter();
const showPopup = ref(false);
const difficulty = ref('');
const year = ref(storeStudy.year[storeStudy.reverseChoiceMap[route.params.choice]]);
const openPopup = chosenDifficulty => {
    difficulty.value = chosenDifficulty;
    showPopup.value = true;
    document.addEventListener('mousedown', onClickOutside);
}
const onDecline = () => {
    storeQuiz.questions = [null];
    showPopup.value = false;
    document.removeEventListener('click', onClickOutside2);
}

const storeQuiz = useStoreQuiz();
const start = async() => {
    document.removeEventListener('click', onClickOutside);
    await storeQuiz.createQuiz(storeStudy.typesMap[storeQuiz.type], storeStudy.reverseChoiceMap[route.params.choice], difficulty.value);
    router.push({name: "quiz", params: {type: storeStudy.typesMap[storeQuiz.type], choice: route.params.choice, difficulty: difficulty.value, current: 1}});
}
const activeDifficulty = ref(null);
const difficultyLevels = [
  'noob',
  'veryEasy',
  'easy',
  'normal',
  'hard',
  'veryHard',
  'absoluteMadman'
];
const formatLabel = ref({
    "noob": "Noob",
    "veryEasy": "Very easy",
    "easy": "Easy",
    "normal": "Normal",
    "hard": "Hard",
    "veryHard": "Very Hard",
    "absoluteMadman": "Absolute madman"
})
</script>

<template>
    <div v-if="!storeQuiz.loading">
        <PageTop customH1Class="text-5xl max-xl:text-4xl max-lg:text-3xl font-bold">{{ storeStudy.reverseChoiceMap[route.params.choice] }}</PageTop>
        <h2 class="mt-12 flex justify-center text-brand text-3xl lg:text-4xl xl:text-5xl">Choose difficulty</h2>
        <div class="flex flex-col items-center mt-4 lg:mt-6 xl:mt-8 gap-6">
            <DarkBtn v-for="level in difficultyLevels" :key="level" class="diffBtn" @mouseover="activeDifficulty = level" @mouseleave="activeDifficulty = null" @click="openPopup(level)">{{ formatLabel[level] }}</DarkBtn>
        </div>
    
        
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'noob'">
                <img src="../assets/images/difficulties/noob/noob1.png" alt="one small lego" class="fixed top-64 left-40 w-24 ml-4 mt-1 2xl:w-36 2xl:top-56 2xl:ml-6">
                <img src="../assets/images/difficulties/noob/noob2.png" alt="cute little penguin" class="fixed top-80 left-40 w-32 2xl:w-48">
                <p class="bottom-1/3 right-32 transitionNote">Taking your first steps?<br>No pressure, just fun! :)</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'veryEasy'">
                <img src="../assets/images/difficulties/veryEasy/veryEasy1.png" alt="an orange couch" class="fixed right-40 bottom-56 w-120 max-2xl:right-0">
                <img src="../assets/images/difficulties/veryEasy/veryEasy2.png" alt="an orange cat" class="fixed right-96 bottom-80 mr-16 w-32 max-2xl:right-56">
                <img src="../assets/images/difficulties/veryEasy/veryEasy3.png" alt="a sleepy dog" class="fixed right-48 bottom-80 w-32 ml-12 max-2xl:right-12">
                <p class="bottom-1/2 left-32 transitionNote">Breezy and smooth,<br>just enjoy the ride! :)</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'easy'">
                <img src="../assets/images/difficulties/easy/easy1.jpg" alt="a table" class="fixed left-0 bottom-0 w-[450px] 2xl:w-[650px]">
                <img src="../assets/images/difficulties/easy/easy2.png" alt=" a book and a pencil" class="fixed left-56 bottom-4 w-40 2xl:left-80 2xl:w-64 2xl:bottom-6">
                <img src="../assets/images/difficulties/easy/easy3.png" alt="a plant" class="fixed left-0 bottom-8 w-24 2xl:w-40 2xl:bottom-4">
                <p class="bottom-1/2 right-32 transitionNote">Just enough to<br>get your brain going! :)</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'normal'">
                <img src="../assets/images/difficulties/normal/normal1.png" alt="a chair" class="fixed right-4 top-56 w-32 2xl:w-48">
                <img src="../assets/images/difficulties/normal/normal2.png" alt="a woman sitting, blowing a bubble from a bubble gum, and reading a book" class="fixed right-16 top-32 mt-6 w-48 2xl:w-64">
                <p class="bottom-1/3 left-32 transitionNote">Not too easy, not too hard.<br>Just right.</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'hard'">
                <img src="../assets/images/difficulties/hard/hard1.png" alt="a man running and lifting weights" class="fixed left-16 top-1/2 w-96">
                <img src="../assets/images/difficulties/hard/hard2.png" alt="the Sun" class="fixed left-8 top-[40%] w-32">
                <p class="top-[40%] right-32 transitionNote">Focus up! This one's<br>gonna make you think.</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'veryHard'">
                <img src="../assets/images/difficulties/veryHard/veryHard.png" alt="a man running while papers are falling around him" class="fixed right-24 top-64 w-80">
                <p class="top-2/3 left-32 transitionNote">Prepare for suffering.<br>Only the strong survive!</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="activeDifficulty === 'absoluteMadman'">
                <img src="../assets/images/difficulties/absoluteMadman/absoluteMadman.png" alt="a skull with a hand above it, coming from the dark" class="fixed left-12 bottom-32 w-[450px]">
                <p class="bottom-1/2 right-32 transitionNote">You have chosen PAIN.<br>Godspeed, you maniac!</p>
            </div>
        </transition>
        <div v-show="showPopup">
            <Popup ref="dialog" @confirm="start" @decline="onDecline">Start quiz?</Popup>
            <p class="fixed bottom-20 left-1/2 translate-x-[-50%] text-brand text-base font-bold text-center 2xl:bottom-32 2xl:text-xl">Note: the data for this quiz<br>is from {{ year }}</p>
        </div>
    </div>

    <CenterMessage v-else>Creating your quiz...</CenterMessage>
</template>

<style scoped>
/* transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 300ms ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}

/* buttons */
.diffBtn {
    width: 14rem;
    height: 3.5rem;
}
@media (min-width: 1280px) and (min-height: 850px) {
    .diffBtn {
        width: 16rem;
        height: 4rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}
</style>