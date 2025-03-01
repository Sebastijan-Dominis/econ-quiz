<script setup>
// imports
import { useStoreQuiz } from '../stores/storeQuiz';
import { onBeforeUnmount, onUnmounted, ref, watchEffect } from 'vue';
import QuizBtn from '../components/QuizBtn.vue';
import NavBtn from '../components/NavBtn.vue';
import { useRouter } from 'vue-router';
import Popup from '../components/Popup.vue';

// fetching the questions
const storeQuiz = useStoreQuiz();

// managing the popup
const popupOpen = ref(false);
const confirmation = ref(null);
const dialog = ref(null);
const router = useRouter();
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
        popupOpen.value = false;    
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
}

// managing the quiz flow
const curr = ref(1);
const usersChoice = ref(new Array(storeQuiz.questions));
const chooseAnswer = function(option) {
    usersChoice.value[curr.value] = option;
}
const nextQ = () => {
    if(storeQuiz.questions[curr.value].answer === usersChoice.value[curr.value]) storeQuiz.correctAnswers++;
    curr.value++;
}
const prevQ = () => {
    if(curr.value > 1) curr.value--;
    if(storeQuiz.questions[curr.value].answer === usersChoice.value[curr.value]) storeQuiz.correctAnswers--;
}

// finishing
const done = ref(false);
const finish = () => {
    if(storeQuiz.questions[curr.value].answer === usersChoice.value[curr.value]) storeQuiz.correctAnswers++;
    done.value = true;
}
onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside2);
    storeQuiz.questions = [];
    storeQuiz.correctAnswers = 0;
})
</script>

<template>
    <!-- quiz flow -->
    <div v-if="!done && !storeQuiz.loading && !storeQuiz.error">
        <h1 class="pt-8 text-brand text-base font-bold flex text-center justify-center md:text-xl md:pt-10 md:text-3xl lg:pt-12 xl:text-4xl 2xl:text-5xl">{{ storeQuiz.questions[curr].question }}</h1>
        <div class="grid grid-cols-1 gap-y-12 mt-16 md:grid-cols-2 md:gap-y-28 md:mt-24 md:px-12 lg:px-20 2xl:px-36 place-items-center">
            <QuizBtn v-for="option in [storeQuiz.questions[curr].A, storeQuiz.questions[curr].B, storeQuiz.questions[curr].C, storeQuiz.questions[curr].D]"
            :key="option"
            :class="usersChoice[curr] === option ? 'chosenAnswer' : ''"
            @click="chooseAnswer(option)">{{ option }}</QuizBtn>
        </div>
        <div class="grid grid-cols-2 place-items-center mt-10 mx-40 md:mx-16 md:mt-16 lg:mx-20 2xl:mx-36">
            <NavBtn :class="curr === 1 ? 'disabled active:scale-[1] disableBtn' : ''" @click="prevQ">Prev</NavBtn>
            <NavBtn v-if="curr !== storeQuiz.questions.length-1" @click="nextQ">Next</NavBtn>
            <NavBtn v-else @click="finish">Finish</NavBtn>
        </div>
        <div class="flex justify-center mt-10">
            <button @click="openPopup" class="w-14 h-8 bg-bgbtn text-wg border border-2 border-brand rounded-lg md:w-20 md:h-12 lg:w-28 lg:h-14 2xl:mt-16 hover:bg-brand hover:text-bg active:scale-[0.98]">Quit</button>
        </div>
        <div v-show="popupOpen">
            <Popup ref="dialog" @confirm="quitYes" @decline="quitNo" customClass="mt-2 max-md:mt-4">Are you sure you want to quit</Popup>
        </div>
    </div>

    <!-- display results -->
    <div v-if="done && !storeQuiz.loading && !storeQuiz.error" class="flex flex-col text-center items-center justify-center pt-12 px-24 2xl:pt-20">
    <h1 class="text-2xl text-brand font-bold 2xl:text-3xl">You have answered {{ storeQuiz.correctAnswers }} out of {{ storeQuiz.questions.length-1 }} questions correctly!</h1>
    <NavBtn @click="router.push('/')" :class="'mt-24 2xl:mt-32'">Ok</NavBtn>
    </div>
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