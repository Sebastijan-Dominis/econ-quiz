import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/Home.vue';
import StudyChoice from '../views/StudyChoice.vue';
import FAQ from "../views/FAQ.vue";
import Leaderboard from "../views/Leaderboard.vue";
import Results from "../views/Results.vue";
import QuizChoice from "../views/QuizChoice.vue";
import Add from "../views/Add.vue";
import Edit from "../views/Edit.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import ResultsChoice from "../views/ResultsChoice.vue";
import Study from "../views/Study.vue";

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/study-choice', name: 'study-choice', component: StudyChoice },
    { path: '/faq', name: 'faq', component: FAQ },
    { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
    { path: '/results', name: 'results', component: Results},
    { path: '/quiz-choice', name: 'quiz-choice', component: QuizChoice },
    { path: '/add', name: 'add', component: Add },
    { path: '/edit', name: 'edit', component: Edit },
    { path: '/signup', name: 'signup', component: Signup },
    { path: '/login', name: 'login', component: Login },
    { path: '/results-choice', name: 'results-choice', component: ResultsChoice },
    { path: '/study/:choice', name: 'study', component: Study }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;