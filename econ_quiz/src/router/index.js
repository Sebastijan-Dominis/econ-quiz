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
import QuizDifficultyChoice from "../views/QuizDifficultyChoice.vue";
import Quiz from "../views/Quiz.vue";
import Resend from "../views/Resend.vue";
import Reset from "../views/Reset.vue";
import { useStoreAuth } from "../stores/storeAuth";

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
    { path: '/study/:choice', name: 'study', component: Study },
    { path: '/quiz-difficulty-choice/:choice', name: 'quiz-difficulty-choice', component: QuizDifficultyChoice },
    { path: '/quiz/:choice/:difficulty/:current', name: 'quiz', component: Quiz },
    { path: '/resend', name: 'resend', component: Resend },
    { path: '/reset', name: 'reset', component: Reset },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// navigation guards
router.beforeEach(async (to, from) => {
    const storeAuth = useStoreAuth();

    if(storeAuth.user && (to.name === 'login' || to.name === 'signup')) {
        return { name: from.name };
    }

    return true;
})

export default router;

// refreshing and typing the link directly doesn't work, gpt not helpful