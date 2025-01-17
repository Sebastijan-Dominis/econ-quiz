<script>
    import BrandBtn from '../components/BrandBtn.vue';
    import DarkBtn from '../components/DarkBtn.vue';

    export default {
        name: 'Home',
        components: {
            BrandBtn,
            DarkBtn
        },
        data() {
            return {
                isLoggedIn: true,
                isAdmin: true
            };
        }
    }
</script>

<template>
    <router-view />
    <nav class="flex justify-between items-center px-10 py-6">
        <div class="flex gap-4">
            <router-link to="results"><DarkBtn>Results</DarkBtn></router-link>
            <router-link to="leaderboard"><DarkBtn>Leaderboard</DarkBtn></router-link>
            <router-link to="/study"><DarkBtn>Study</DarkBtn></router-link>
        </div>

        <div class="flex gap-4">
            <router-link to="login"><DarkBtn>Login</DarkBtn></router-link>
            <router-link to="signup"><BrandBtn>Sign Up</BrandBtn></router-link>
        </div>
    </nav>

    <p v-if="!isLoggedIn" class="absolute left-1/2 top-40 text-brand text-3xl transform -translate-x-1/2 text-center font-normal">You are not logged in. Log in to<br>save your results!</p>
    <p v-else class="absolute left-1/2 top-40 text-brand text-3xl transform -translate-x-1/2 text-center font-normal">Welcome, Username! :)</p>

    <h1 class="absolute left-1/2 transform -translate-x-1/2 top-96 text-brand text-6xl text-center font-bold">Welcome to Econ Quiz!</h1>

    <router-link to="quiz-choice"><button class="w-56 h-24 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute left-1/2 transform -translate-x-1/2 bottom-64 text-3xl">Play Now!</button></router-link>

    <img src="../assets/images/happy.png" alt="a happy man looking to the right direction" class="absolute bottom-0 left-24 w-56">
    <p class="absolute bottom-0 left-24 text-brand text-2xl font-normal text-center">Learn, test<br>yourself, and have<br>lots of fun!</p>

    <img src="../assets/icons/arrow.svg" alt="an arrow pointing from the happy man to the play now button" class="absolute left-80 bottom-40 max-lg:hidden">

    <div v-if="isLoggedIn && isAdmin" class="absolute top-56 right-6 flex flex-col gap-6 items-center">
        <h2 class="text-2xl text-brand font-normal">Admin Options</h2>
        <nav class="flex flex-col gap-6">
            <router-link to="add"><DarkBtn>Add</DarkBtn></router-link>
            <router-link to="edit"><DarkBtn>Edit</DarkBtn></router-link>
        </nav>
    </div>

    <p class="absolute bottom-60 right-4 text-2xl text-brand font-normal">Got Questions?</p>
    <router-link to="faq"><DarkBtn class="absolute bottom-44 right-8">FAQ</DarkBtn></router-link>
    <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="absolute bottom-0 -right-4 w-64">
</template>