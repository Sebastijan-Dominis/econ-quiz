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
                isAdmin: true,
                logoutq: false,
                hello: "",
            };
        },
        methods: {
            logoutYes() {
                this.logoutq = false;
                this.isLoggedIn = false;
            },
            logoutNo() {
                this.logoutq = false;
            },
            typeHello() {
                const text = "Hello, Username! :)";
                this.hello = "";
                text.split("").forEach((_, i) => {
                    setTimeout(() => {
                        this.hello = text.slice(0, i + 1);
                    }, i * 300);
                });

                setTimeout(() => {
                    this.typeHello();
                }, text.length * 300 + 1000); 
            }
        },
        mounted() {
            this.typeHello();
        }

    }
</script>

<template>
    <!-- Mobile -->
    <h1 class="text-brand text-3xl text-center font-bold pt-4 md:hidden">Welcome to Econ Quiz!</h1>
    <p class="text-brand text-center font-bold mt-8 md:hidden">For the best experience, use your desktop computer</p>
    <h2 v-if="!isLoggedIn" class="text-brand text-center font-bold mt-8 text-2xl md:hidden">You are not logged in. Log in to save your results!</h2>
    <h2 v-else class="text-brand text-center font-bold mt-8 text-2xl md:hidden">{{ hello }}</h2>

    <div v-if="isLoggedIn" class="w-full flex justify-center mt-8 md:hidden">
        <DarkBtn class="w-32 h-12" @click="this.logoutq = true">Logout</DarkBtn>
    </div> 
    <div v-else class="w-full flex px-32 pb-8 mt-8 justify-between md:hidden">
        <router-link to="/login"><DarkBtn class="w-32 h-12">Login</DarkBtn></router-link>
        <router-link to="/signup"><BrandBtn class="w-32 h-12">Sign Up</BrandBtn></router-link>
    </div> 

    <div class="w-full flex justify-center mt-16 md:hidden">
        <router-link to="quiz-choice"><DarkBtn class="w-48 h-20">Play Now!</DarkBtn></router-link>
    </div>

    <div class="w-full mt-16 pl-4 md:hidden">
        <router-link to="results-choice"><DarkBtn class="w-32 h-12">Results</DarkBtn></router-link>
    </div>

    <div class="w-full flex mt-8 px-4 pb-8 justify-between md:hidden">
        <router-link to="leaderboard"><DarkBtn class="w-32 h-12">Leaderboard</DarkBtn></router-link>
        <p v-if="isLoggedIn && isAdmin" class="text-center w-80 text-brand md:hidden">To use Admin options, please use your desktop computer</p>
    </div> 

    <div class="w-full flex px-4 pb-8 justify-between md:hidden">
        <router-link to="/study"><DarkBtn class="w-32 h-12">Study</DarkBtn></router-link>
        <router-link to="faq"><DarkBtn class="w-32 h-12">FAQ</DarkBtn></router-link>
    </div> 


    <!-- Desktop and Tablet -->
    <router-view />
    <nav class="flex justify-between items-center px-10 py-6 max-md:hidden">
        <div class="flex gap-4">
            <router-link to="results-choice"><DarkBtn>Results</DarkBtn></router-link>
            <router-link to="leaderboard"><DarkBtn>Leaderboard</DarkBtn></router-link>
            <router-link to="study-choice"><DarkBtn>Study</DarkBtn></router-link>
        </div>

        <div v-if="!isLoggedIn" class="flex gap-4">
            <router-link to="login"><DarkBtn>Login</DarkBtn></router-link>
            <router-link to="signup"><BrandBtn>Sign Up</BrandBtn></router-link>
        </div>
        <div v-else>
            <DarkBtn @click="this.logoutq = true">Logout</DarkBtn>
        </div>
    </nav>

    <p v-if="!isLoggedIn" class="absolute left-1/2 top-40 max-2xl:top-32 max-xl:top-24  text-brand text-3xl max-2xl:text-2xl transform -translate-x-1/2 text-center font-normal max-md:hidden">You are not logged in. Log in to<br>save your results!</p>
    <p v-else class="absolute left-1/2 top-40 max-xl:top-24 max-2xl:top-32 text-brand text-3xl max-2xl:text-2xl transform -translate-x-1/2 text-center font-normal max-md:hidden">{{ hello }}</p>

    <h1 class="absolute left-1/2 transform -translate-x-1/2 top-80 text-brand text-6xl max-2xl:text-5xl text-center font-bold max-2xl:top-64 max-xl:top-48 max-md:hidden">Welcome to Econ Quiz!</h1>

    <router-link to="quiz-choice"><button class="w-56 h-24 2xl:w-72 2xl:h-32 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg absolute left-1/2 transform -translate-x-1/2 bottom-64 text-3xl hover:bg-brand hover:text-bg hover:border-bg active:scale-98 max-lg:bottom-16 max-md:hidden">Play Now!</button></router-link>

    <img src="../assets/images/happy.png" alt="a happy man looking to the right direction" class="absolute bottom-0 left-24 w-56 max-lg:hidden">
    <p class="absolute bottom-0 left-24 text-brand text-2xl font-normal text-center max-lg:hidden">Learn, test<br>yourself, and have<br>lots of fun!</p>

    <img src="../assets/icons/arrow.svg" alt="an arrow pointing from the happy man to the play now button" class="absolute left-80 bottom-40 max-lg:hidden">

    <div v-if="isLoggedIn && isAdmin" class="absolute top-56 right-6 flex flex-col gap-6 items-center max-md:hidden">
        <h2 class="text-2xl text-brand font-normal">Admin Options</h2>
        <nav class="flex flex-col gap-6">
            <router-link to="add"><DarkBtn>Add</DarkBtn></router-link>
            <router-link to="edit"><DarkBtn>Edit</DarkBtn></router-link>
            <router-link to="faq"><DarkBtn class="lg:hidden">FAQ</DarkBtn></router-link>
        </nav>
    </div>

    <p class="absolute bottom-60 max-xl:bottom-32 right-4 text-2xl text-brand font-normal max-lg:hidden">Got Questions?</p>
    <router-link to="faq"><DarkBtn class="absolute bottom-44 max-xl:bottom-16 right-8 max-lg:hidden">FAQ</DarkBtn></router-link>
    <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="absolute bottom-0 right-0 w-64 max-xl:hidden">

    <!-- Logout? -->
    <div v-if="logoutq">
        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
        <div class="fixed w-[425px] h-[234px] border border-brand border-4 bg-bgbtn rounded-3xl text-brand absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <h1 class="text-3xl text-wg text-center mt-4">Are you sure you want to log out?</h1>
            <div class="flex flex-row justify-between px-10 mt-12">
                <DarkBtn @click="logoutYes" class="w-36 h-14">Yes</DarkBtn>
                <BrandBtn @click="logoutNo" class="w-36 h-14">No</BrandBtn>
            </div>
        </div>
    </div>
</template>