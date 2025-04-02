<script setup>
// imports
import BrandBtn from '../components/BrandBtn.vue';
import DarkBtn from '../components/DarkBtn.vue';
import Popup from '../components/Popup.vue';
import { ref, watchEffect, onBeforeUnmount } from 'vue';
import { useStoreAuth } from '../stores/storeAuth';
import { useStoreQuiz } from '../stores/storeQuiz';
import { useStoreStudy } from '../stores/storeStudy';
import { useRouter } from 'vue-router';

// logging process
const storeAuth = useStoreAuth();

const logoutYes = function() {
    document.removeEventListener('click', onClickOutside);
    storeAuth.logoutUser();
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
    const text = `Hello, ${username}! :) `;
    hello.value = "";
    text.split('').forEach((_, i) => {
        setTimeout(() => {
            hello.value = text.slice(0, i);
        }, i*300);
    })
    setTimeout(() => {
        typeHello();
    }, text.length*300 + 1000);
}

watchEffect(() => {
    if(storeAuth.user && storeAuth.user.displayName !== null) {
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
const onClickOutside = () => {
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

// choosing quiz type
const typePopup = ref(false);
const hoverType = ref(false);
const storeQuiz = useStoreQuiz();
const storeStudy = useStoreStudy();
const router = useRouter();
const chooseType = function(type) {
    storeQuiz.type = type;
    router.push(`/quiz-choice/${storeStudy.typesMap[type]}`);
}

// cleaning up
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside);
    document.removeEventListener('click', onClickOutside2);
})
</script>

<template>
    <!-- Small screens -->
    <div class="h-[100vh] flex flex-col justify-between text-brand lg:hidden">
        <h1 class="smallWelcomeMessage">Welcome to Econ Quiz!</h1>
        <h2 v-show="!storeAuth.isLoggedIn" class="smallHelloMessage">You are not logged in. Log in to save your results!</h2>
        <h2 v-show="storeAuth.isLoggedIn" class="smallHelloMessage">{{ hello }}</h2>
    
        
        <div>
            <div v-if="storeAuth.isLoggedIn" class="flex justify-evenly smallLog">
                <DarkBtn class="smallSmallBtn" @click="openPopup">Logout</DarkBtn>
            </div> 
            <div v-else class="flex justify-evenly smallLog">
                <router-link :to="{name: 'login'}"><DarkBtn class="smallSmallBtn">Login</DarkBtn></router-link>
                <router-link :to="{name: 'signup'}"><BrandBtn class="smallSmallBtn">Sign Up</BrandBtn></router-link>
            </div> 
            <div class="flex justify-center mt-20 md:mt-40 smallPlay">
                <DarkBtn class="w-48 h-20 smallPlayBtn" @click="typePopup = true">Play Now!</DarkBtn>
            </div>
        
            <div class="flex mt-16 px-4 justify-between md:mt-28 smallFirstRow">
                <router-link :to="{name: 'results'}"><DarkBtn class="smallSmallBtn">Results</DarkBtn></router-link>
                <router-link :to="{name: 'add'}"><DarkBtn v-if="storeAuth.isLoggedIn && storeAuth.isAdmin" class="smallSmallBtn">Add</DarkBtn></router-link>
            </div>
        
            <div class="flex mt-8 px-4 pb-8 justify-between">
                <router-link :to="{name: 'leaderboard'}"><DarkBtn class="smallSmallBtn">Leaderboard</DarkBtn></router-link>
                <router-link :to="{name: 'edit-choice'}"><DarkBtn v-if="storeAuth.isLoggedIn && storeAuth.isAdmin" class="smallSmallBtn">Edit/Delete</DarkBtn></router-link>
            </div> 
        
            <div class="flex px-4 pb-8 justify-between smallLastRow">
                <router-link :to="{name: 'study-choice'}"><DarkBtn class="smallSmallBtn">Study</DarkBtn></router-link>
                <router-link :to="{name: 'faq'}"><DarkBtn class="smallSmallBtn">FAQ</DarkBtn></router-link>
            </div> 
        </div>
    </div>


    <!-- Desktop and Tablet -->
    <router-view />
    <div class="max-lg:hidden">
        <nav class="flex justify-between items-center px-10 py-6">
            <div class="flex gap-4">
                <router-link :to="{name: 'results'}"><DarkBtn class="smallBtn">Results</DarkBtn></router-link>
                <router-link :to="{name: 'leaderboard'}"><DarkBtn class="smallBtn">Leaderboard</DarkBtn></router-link>
                <router-link :to="{name: 'study-choice'}"><DarkBtn class="smallBtn">Study</DarkBtn></router-link>
            </div>
            <div v-if="storeAuth.isLoggedIn">
                <DarkBtn @click="openPopup">Logout</DarkBtn>
            </div>
            <div v-else class="flex gap-4">
                <router-link :to="{name: 'login'}"><DarkBtn class="smallBtn">Login</DarkBtn></router-link>
                <router-link :to="{name: 'signup'}"><BrandBtn class="smallBtn">Sign up</BrandBtn></router-link>
            </div>
        </nav>
        
        <h1 class="text-brand text-center font-bold text-4xl 2xl:text-5xl mt-28 welcomeMessage">Welcome to Econ Quiz!</h1>

        <p v-if="!storeAuth.isLoggedIn" class="helloMessage">You are not logged in. Log in to<br>save your results!</p>
        <p v-else class="helloMessage">{{ hello }}</p>

        <button class="w-56 h-24 2xl:w-72 2xl:h-32 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute left-1/2 transform -translate-x-1/2 bottom-64 text-3xl lg:hover:bg-brand lg:hover:text-bg lg:hover:border-bg lg:active:scale-98 -lg:hidden-lg:bottom-16 playBtn" @click="typePopup = true">Play Now!</button>

        <img src="../assets/images/happy.png" alt="a happy man looking to the right direction" class="absolute bottom-0 left-24 w-56 happyGuy">
        <p class="absolute bottom-0 left-24 text-brand text-2xl font-normal text-center happyMessage">Learn, test<br>yourself, and have<br>lots of fun!</p>

        <img src="../assets/icons/arrow.svg" alt="an arrow pointing from the happy man to the play now button" class="absolute left-80 bottom-40 arrow">

        <div v-if="storeAuth.isLoggedIn && storeAuth.isAdmin" class="absolute top-1/2 transform -translate-y-[70%] right-6 flex flex-col gap-6 items-center">
            <h2 class="text-2xl text-brand font-normal">Admin Options</h2>
            <nav class="flex flex-col gap-6">
                <router-link :to="{name: 'add'}"><DarkBtn class="smallBtn">Add</DarkBtn></router-link>
                <router-link :to="{name: 'edit-choice'}"><DarkBtn class="smallBtn">Edit/Delete</DarkBtn></router-link>
            </nav>
        </div>

        <p class="absolute bottom-60 right-4 text-2xl text-brand font-normal max-xl:hidden">Got Questions?</p>
        <router-link :to="{name: 'faq'}"><DarkBtn class="absolute bottom-44 right-8 max-xl:bottom-6">FAQ</DarkBtn></router-link>
        <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="absolute bottom-0 right-0 w-64 max-xl:hidden">

    </div>
    <!-- Logout? -->
    <div v-show="storeAuth.logoutq">
        <Popup ref="dialog" @confirm="logoutYes" @decline="logoutNo">Are you sure you want to log out?</Popup>
    </div>

    <!-- type choice -->
    <div v-show="typePopup" class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95">
        <div class="fixed top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
            <h2 class="flex justify-center text-center text-brand text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl w-[90vw]">What kind of a quiz do you want to play?</h2>
            <div class="flex flex-col items-center gap-12 mt-24 typeBtnsContainer">
                <DarkBtn @click="chooseType('Multiple Choice')" @mouseover="hoverType = 'Multiple Choice'" @mouseleave="hoverType=null" class="typeBtn w-96 h-28 text-2xl">Multiple Choice</DarkBtn>
                <DarkBtn @click="chooseType('Timed')" @mouseover="hoverType = 'Timed'" @mouseleave="hoverType=null" class="typeBtn w-96 h-28 text-2xl">Timed</DarkBtn>
                <DarkBtn @click="chooseType('Manual Input')" @mouseover="hoverType = 'Manual Input'" @mouseleave="hoverType=null" class="typeBtn w-96 h-28 text-2xl">Manual Input</DarkBtn>
            </div>
            <div class="flex justify-center mt-32 closeBtnContainer">
                <DarkBtn @click="typePopup = false" class="closeBtn w-64 h-20 text-xl">Close</DarkBtn>
            </div>
        </div>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="hoverType === 'Multiple Choice'">
                <div class="fixed left-20 bottom-96 w-[450px] grid grid-cols-2 gap-4">
                    <div class="mulChBtn">?</div>
                    <div class="mulChBtn">?</div>
                    <div class="mulChBtn">?</div>
                    <div class="mulChBtn">?</div>
                </div>
                <p class="bottom-1/2 right-32 transitionNote">You prefer classic quiz format with<br>multiple options? This is it!</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="hoverType === 'Timed'">
                <img src="../assets/images/types/sandclock.png" alt="sandclock" class="fixed right-24 top-64 w-40 2xl:w-64">
                <p class="top-2/3 left-32 transitionNote">You want to see how quickly<br>you can remember those numbers?<br>This one's for you!</p>
            </div>
        </transition>
        <transition name="fade" class="max-xl:hidden">
            <div v-show="hoverType === 'Manual Input'">
                <img src="../assets/images/types/notebook.png" alt="a notebook" class="fixed left-8 top-[40%] w-32 2xl:left-20 2xl:w-48">
                <img src="../assets/images/types/pencil.png" alt="a pencil" class="fixed left-24 top-1/2 w-40 2xl:left-40 2xl:w-64">
                <p class="top-[40%] right-32 transitionNote">You know the numbers by heart?<br>Try this one out!</p>
            </div>
        </transition>
    </div>
    
</template>


<style scoped>
/* animations */
.fade-enter-active, .fade-leave-active {
    transition: opacity 300ms ease-in-out;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.fade-enter-to, .fade-leave-from {
    opacity: 1;
}

/* self-made "image" */
.mulChBtn {
    width: 9rem;
    height: 3.5rem;
    border-radius: 9999px;
    background-color: var(--bgbtn);
    border-color: var(--gray);
    border-width: 2px;
    font-weight: 500;
    color: var(--gray);
    text-align: center;
    place-content: center;
}

/* large screens defaults */
.helloMessage {
    margin-top: 6rem;
    color: var(--brand);
    font-size: 1.5rem;
    line-height: 2rem;
    text-align: center;
    font-weight: 400;
}

/* iPad Pro, secondarily nest hub */
@media (min-width: 1024px) and (max-width: 1279px) {
    .playBtn {
        bottom: 10rem;
    }
    .arrow {
        bottom: 6rem;
        left: 14rem;
        width: 10rem;
    }
    .happyGuy {
        width: 10rem;
        left: 4rem;
    }
    .happyMessage {
        font-size: 1.25rem;
        line-height: 1.75rem;
        left: 4rem;
    }
}

/* nest hub, landscape mode */
@media (min-width: 1024px) and (min-height: 580px) and (max-height: 880px) {
    .welcomeMessage {
        margin-top: 2rem;
    }
    .helloMessage {
        margin-top: 4rem;
    }
}

/* landscape mode */
@media (min-width: 1024px) and (max-height: 579px) {
    .welcomeMessage {
        margin-top: 1rem;
        font-size: 1.5rem;
        line-height: 2rem;
    }
    .helloMessage {
        margin-top: 2rem;
        font-size: 1.125rem !important;
        line-height: 1.75rem !important;
    }
}

/* laptops */
@media (min-width: 1280px) and (max-width: 1535px) {
    .smallBtn {
        height: 4rem;
        width: 11rem;
    }
    .playBtn {
        height: 7rem;
        width: 16rem;
    }
}

/* laptop small height */
@media (min-width: 1280px) and (max-height: 670px) {
    .smallBtn {
        height: 3.5rem;
        width: 9rem;
    }
    .playBtn {
        height: 6rem;
        width: 14rem;
    }
    .welcomeMessage {
        margin-top: 0;
    }
}

/* Desktop PCs */
@media (min-width: 1536px) {
    .helloMessage {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    .smallBtn {
        height: 5rem;
        width: 13rem;
    }
    .playBtn {
        height: 9rem;
        width: 21rem;
    }
}

/* desktop small height */
@media (min-width: 1536px) and (max-height: 750px) {
    .smallBtn {
        height: 4rem;
        width: 11rem;
    }
    .playBtn {
        height: 7rem;
        width: 16rem;
    }
}

/* desktop very small height */
@media (min-width: 1536px) and (max-height: 670px) {
    .smallBtn {
        height: 3.5rem;
        width: 9rem;
    }
    .playBtn {
        height: 6rem;
        width: 14rem;
    }
    .welcomeMessage {
        margin-top: 0;
    }
}

/*//////////////////////////////////////////////////////*/



/* small screens defaults */
.smallWelcomeMessage {
    font-size: 1.875rem;
    line-height: 2.25rem;
    text-align: center;
    font-weight: 700;
    padding-top: 0.5rem;
}
.smallHelloMessage {
    text-align: center;
    font-weight: 700;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
}

/* iPhone SE */
@media (max-width: 640px) and (max-height: 700px) {
    .smallWelcomeMessage {
        font-size: 1.5rem;
        line-height: 2rem;
    }
    .smallHelloMessage {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}

/* ipad mini */
@media (min-width: 768px) and (max-width: 1024px) and (max-height: 1150px) {
    .smallSmallBtn {
        height: 4rem;
        width: 11rem;
    }
    .smallPlayBtn {
        height: 7rem;
        width: 16rem;
    }
    .smallWelcomeMessage {
        font-size: 2.25rem;
        line-height: 2.5rem;
    }
    .smallHelloMessage {
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
}


/* ipad air */
@media (min-width: 768px) and (max-width: 1024px) and (min-height: 1150px) and (max-height: 1250px) {
    .smallHelloMessage {
        font-size: 1.5rem;
        line-height: 2rem;
    }
    .smallWelcomeMessage {
        font-size: 3rem;
        line-height: 1;
    }
    .smallSmallBtn {
        height: 4rem;
        width: 11rem;
    }
    .smallPlayBtn {
        height: 7rem;
        width: 16rem;
    }
}

/* surface pro 7 */
@media (min-width: 768px) and (max-width: 1024px) and (min-height: 1250px) {
    .smallHelloMessage {
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    .smallWelcomeMessage {
        font-size: 3.75rem;
        line-height: 1;
    }
    .smallSmallBtn {
        height: 5rem;
        width: 13rem;
    }
    .smallPlayBtn {
        height: 9rem;
        width: 20rem;
    }
}



/* type choice buttons */
/* ----------------------------------------------- */
/* bigger tablets and laptops */
@media (max-width: 1535px) {
    .typeBtn {
        width: 20rem;
        height: 6rem;
        font-size: 1.25rem;
        line-height: 1.75rem;
    }
    .closeBtn {
        width: 15rem;
        height: 4.5rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
}
/* tablets */
@media (max-width: 1023px) or (max-height: 800px) {
    .typeBtn {
        width: 18rem;
        height: 5rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
    .closeBtn {
        width: 12rem;
        height: 4rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
}
/* mobile phones */
@media (max-width: 639px) or (max-height: 650px) {
    .typeBtn {
        width: 14rem;
        height: 4rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
    .closeBtn {
        width: 10rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
}

/* for small heights */
@media (max-height: 800px) {
    .typeBtnsContainer {
        margin-top: 4rem;
    }
    .closeBtnContainer {
        margin-top: 5rem;
    }
}
@media (max-height: 650px) {
    .typeBtnsContainer {
        margin-top: 2rem;
    }
    .closeBtnContainer {
        margin-top: 2.5rem;
    }
}
</style>