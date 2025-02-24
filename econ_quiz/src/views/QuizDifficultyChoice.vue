<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import { useRoute } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import DarkBtn from '../components/DarkBtn.vue';
import { reactive } from 'vue';

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
</script>

<template>
    <PageTop customH1Class="text-5xl max-xl:text-4xl max-lg:text-3xl font-bold">{{ storeStudy.reverseChoiceMap[route.params.choice] }}</PageTop>
    <h2 class="mt-12 lg:mt-16 xl:mt-20 2xl:mt-24 flex justify-center text-brand text-3xl lg:text-4xl xl:text-5xl">Choose difficulty</h2>
    <div class="flex flex-col items-center mt-4 lg:mt-6 xl:mt-8 gap-6">
        <DarkBtn class="w-56" @mouseover="difficulties.noob = true" @mouseleave="difficulties.noob = false">Noob</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.veryEasy = true" @mouseleave="difficulties.veryEasy = false">Very Easy</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.easy = true" @mouseleave="difficulties.easy = false">Easy</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.normal = true" @mouseleave="difficulties.normal = false">Normal</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.hard = true" @mouseleave="difficulties.hard = false">Hard</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.veryHard = true" @mouseleave="difficulties.veryHard = false">Very hard</DarkBtn>
        <DarkBtn class="w-56" @mouseover="difficulties.absoluteMadman = true" @mouseleave="difficulties.absoluteMadman = false">Absolute madman</DarkBtn>
    </div>

    
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.noob">
            <img src="../assets/images/difficulties/noob/noob1.png" alt="one small lego" class="fixed top-64 left-40 w-24 ml-4 mt-1 2xl:w-36 2xl:top-56 2xl:ml-6">
            <img src="../assets/images/difficulties/noob/noob2.png" alt="cute little penguin" class="fixed top-80 left-40 w-32 2xl:w-48">
            <p class="fixed bottom-1/3 right-32 text-brand text-2xl 2xl:text-3xl text-center">Taking your first steps?<br>No pressure, just fun! :)</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.veryEasy">
            <img src="../assets/images/difficulties/veryEasy/veryEasy1.png" alt="an orange couch" class="fixed right-40 bottom-56 w-120 max-2xl:right-0">
            <img src="../assets/images/difficulties/veryEasy/veryEasy2.png" alt="an orange cat" class="fixed right-96 bottom-80 mr-16 w-32 max-2xl:right-56">
            <img src="../assets/images/difficulties/veryEasy/veryEasy3.png" alt="a sleepy dog" class="fixed right-48 bottom-80 w-32 ml-12 max-2xl:right-12">
            <p class="fixed bottom-1/2 left-32 text-brand text-2xl 2xl:text-3xl text-center">Breezy and smooth,<br>just enjoy the ride! :)</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.easy">
            <img src="../assets/images/difficulties/easy/easy1.jpg" alt="a table" class="fixed left-0 bottom-0 w-[450px] 2xl:w-[650px]">
            <img src="../assets/images/difficulties/easy/easy2.png" alt=" a book and a pencil" class="fixed left-56 bottom-4 w-40 2xl:left-80 2xl:w-64 2xl:bottom-6">
            <img src="../assets/images/difficulties/easy/easy3.png" alt="a plant" class="fixed left-0 bottom-8 w-24 2xl:w-40 2xl:bottom-4">
            <p class="fixed bottom-1/2 right-32 text-brand text-2xl 2xl:text-3xl text-center">Just enough to<br>get your brain going! :)</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.normal">
            <img src="../assets/images/difficulties/normal/normal1.png" alt="a chair" class="fixed right-4 top-56 w-32 2xl:w-48">
            <img src="../assets/images/difficulties/normal/normal2.png" alt="a woman sitting, blowing a bubble from a bubble gum, and reading a book" class="fixed right-16 top-32 mt-6 w-48 2xl:w-64">
            <p class="fixed bottom-1/3 left-32 text-brand text-2xl 2xl:text-3xl text-center">Not too easy, not too hard.<br>Just right.</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.hard">
            <img src="../assets/images/difficulties/hard/hard1.png" alt="a man running and lifting weights" class="fixed left-16 top-1/2 w-96">
            <img src="../assets/images/difficulties/hard/hard2.png" alt="the Sun" class="fixed left-8 top-[40%] w-32">
            <p class="fixed top-[40%] right-32 text-brand text-2xl 2xl:text-3xl text-center">Focus up! This one's<br>gonna make you think.</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.veryHard">
            <img src="../assets/images/difficulties/veryHard/veryHard.png" alt="a man running while papers are falling around him" class="fixed right-24 top-64 w-80">
            <p class="fixed top-2/3 left-32 text-brand text-2xl 2xl:text-3xl text-center">Prepare for suffering.<br>Only the strong survive.</p>
        </div>
    </transition>
    <transition name="fade" class="max-xl:hidden">
        <div v-show="difficulties.absoluteMadman">
            <img src="../assets/images/difficulties/absoluteMadman/absoluteMadman.png" alt="a skull with a hand above it, coming from the dark" class="fixed left-12 bottom-32 w-[450px]">
            <p class="fixed bottom-1/2 right-32 text-brand text-2xl 2xl:text-3xl text-center">You have chosen PAIN.<br>Godspeed, you maniac.</p>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 300ms ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}
</style>