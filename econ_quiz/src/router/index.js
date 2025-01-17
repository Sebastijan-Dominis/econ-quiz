import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import Study from '../views/Study.vue';
import FAQ from "../views/FAQ.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Results from "../views/Results.vue";
import QuizChoice from "../views/QuizChoice.vue";
import Add from "../views/Add.vue";
import Edit from "../views/Edit.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/study', component: Study },
    { path: '/faq', component: FAQ },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/results', component: Results},
    { path: '/quiz-choice', component: QuizChoice },
    { path: '/add', component: Add },
    { path: '/edit', component: Edit },
    { path: '/signup', component: Signup },
    { path: '/login', component: Login }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;