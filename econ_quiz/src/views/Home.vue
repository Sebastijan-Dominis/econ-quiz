<script setup>
// imports
import BrandBtn from '../components/BrandBtn.vue';
import DarkBtn from '../components/DarkBtn.vue';
import Popup from '../components/Popup.vue';
import { nextTick, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useStoreAuth } from '../stores/storeAuth';

// logging process
const storeAuth = useStoreAuth();

const logoutYes = function() {
    document.removeEventListener('click', onClickOutside);
    storeAuth.logoutUser();
    storeAuth.isLoggedIn = false;
    storeAuth.logoutq = false;
}
const logoutNo = function() {
    document.removeEventListener('click', onClickOutside2);
    storeAuth.logoutq = false;
}

// hello part of the component
let username = "Username";


const hello = ref("");
const typeHello = async function() {
    const text = `Welcome, ${username}! :)`;
    hello.value = "";
    text.split('').forEach((_, i) => {
        setTimeout(() => {
            hello.value = text.slice(0, i+1);
        }, i*300);
    })
    setTimeout(() => {
        typeHello();
    }, text.length*300 + 1000);
}

watchEffect(() => {
    if(storeAuth.user) {
        username = storeAuth.user.displayName;
        typeHello();
    }
})

// closing popup by clicking outside of it
// the solution with nextTick() didn't work, and setTimeout is not optimal
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
        storeAuth.logoutq = false;    
        document.removeEventListener('click', onClickOutside2);
    }
}
const openPopup = () => {
    storeAuth.logoutq = true;
    document.addEventListener('mousedown', onClickOutside);
}
</script>

<template>
    <!-- Mobile -->
    <h1 class="text-brand text-3xl text-center font-bold pt-4 md:hidden">Welcome to Econ Quiz!</h1>
    <p class="text-brand text-center font-bold mt-8 md:hidden">For the best experience, use your desktop computer</p>
    <h2 v-if="!storeAuth.isLoggedIn" class="text-brand text-center font-bold mt-8 text-2xl md:hidden">You are not logged in. Log in to save your results!</h2>
    <h2 v-else class="text-brand text-center font-bold mt-8 text-2xl md:hidden">{{ hello }}</h2>

    <div v-if="storeAuth.isLoggedIn" class="w-full flex justify-center mt-8 md:hidden">
        <DarkBtn class="w-32 h-12" @click="openPopup">Logout</DarkBtn>
    </div> 
    <div v-else class="w-full flex px-32 pb-8 mt-8 justify-between md:hidden">
        <router-link :to="{name: 'login'}"><DarkBtn class="w-32 h-12">Login</DarkBtn></router-link>
        <router-link :to="{name: 'signup'}"><BrandBtn class="w-32 h-12">Sign Up</BrandBtn></router-link>
    </div> 

    <div class="w-full flex justify-center mt-16 md:hidden">
        <router-link :to="{name: 'quiz-choice'}"><DarkBtn class="w-48 h-20">Play Now!</DarkBtn></router-link>
    </div>

    <div class="w-full mt-16 pl-4 md:hidden">
        <router-link :to="{name: 'results-choice'}"><DarkBtn class="w-32 h-12">Results</DarkBtn></router-link>
    </div>

    <div class="w-full flex mt-8 px-4 pb-8 justify-between md:hidden">
        <router-link :to="{name: 'leaderboard'}"><DarkBtn class="w-32 h-12">Leaderboard</DarkBtn></router-link>
        <p v-if="storeAuth.isLoggedIn && storeAuth.isAdmin" class="text-center w-80 text-brand md:hidden">To use Admin options, please use your desktop computer</p>
    </div> 

    <div class="w-full flex px-4 pb-8 justify-between md:hidden">
        <router-link :to="{name: 'study-choice'}"><DarkBtn class="w-32 h-12">Study</DarkBtn></router-link>
        <router-link :to="{name: 'faq'}"><DarkBtn class="w-32 h-12">FAQ</DarkBtn></router-link>
    </div> 


    <!-- Desktop and Tablet -->
    <router-view />
    <div class="max-md:hidden">
        <nav class="flex justify-between items-center px-10 py-6">
            <div class="flex gap-4">
                <router-link :to="{name: 'results-choice'}"><DarkBtn>Results</DarkBtn></router-link>
                <router-link :to="{name: 'leaderboard'}"><DarkBtn>Leaderboard</DarkBtn></router-link>
                <router-link :to="{name: 'study-choice'}"><DarkBtn>Study</DarkBtn></router-link>
            </div>
            <DarkBtn @click="openPopup">Logout</DarkBtn>
        </nav>

        <p v-if="!storeAuth.isLoggedIn" class="absolute left-1/2 top-96 lg:top-24 xl:top-32 2xl:top-40 text-brand text-3xl max-2xl:text-2xl transform -translate-x-1/2 text-center font-normal">You are not logged in. Log in to<br>save your results!</p>
        <p v-else class="absolute left-1/2 top-96 lg:top-24 xl:top-32 2xl:top-40 text-brand text-3xl max-2xl:text-2xl transform -translate-x-1/2 text-center font-normal">{{ hello }}</p>

        <h1 class="absolute left-1/2 transform -translate-x-1/2 top-80 text-brand text-6xl max-2xl:text-5xl text-center font-bold max-2xl:top-64 max-xl:top-48">Welcome to Econ Quiz!</h1>

        <router-link :to="{name: 'quiz-choice'}"><button class="w-56 h-24 2xl:w-72 2xl:h-32 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute left-1/2 transform -translate-x-1/2 bottom-64 text-3xl hover:bg-brand hover:text-bg hover:border-bg active:scale-98 max-lg:bottom-16">Play Now!</button></router-link>

        <img src="../assets/images/happy.png" alt="a happy man looking to the right direction" class="absolute bottom-0 left-24 w-56 max-lg:hidden">
        <p class="absolute bottom-0 left-24 text-brand text-2xl font-normal text-center max-lg:hidden">Learn, test<br>yourself, and have<br>lots of fun!</p>

        <img src="../assets/icons/arrow.svg" alt="an arrow pointing from the happy man to the play now button" class="absolute left-80 bottom-40 max-lg:hidden">

        <div v-if="storeAuth.isLoggedIn && storeAuth.isAdmin" class="absolute top-56 right-6 flex flex-col gap-6 items-center">
            <h2 class="text-2xl text-brand font-normal">Admin Options</h2>
            <nav class="flex flex-col gap-6">
                <router-link :to="{name: 'create'}"><DarkBtn>Add</DarkBtn></router-link>
                <router-link :to="{name: 'edit'}"><DarkBtn>Edit</DarkBtn></router-link>
            </nav>
        </div>

        <p class="absolute bottom-60 max-xl:bottom-32 right-4 text-2xl text-brand font-normal max-lg:hidden">Got Questions?</p>
        <router-link :to="{name: 'faq'}"><DarkBtn class="absolute bottom-44 max-xl:bottom-16 right-8">FAQ</DarkBtn></router-link>
        <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="absolute bottom-0 right-0 w-64 max-xl:hidden">

    </div>
    <!-- Logout? -->
    <div v-show="storeAuth.logoutq">
        <Popup ref="dialog" @confirm="logoutYes" @decline="logoutNo" customClass="mt-2 max-md:mt-4">Are you sure you want to log out?</Popup>
    </div>
    
</template>