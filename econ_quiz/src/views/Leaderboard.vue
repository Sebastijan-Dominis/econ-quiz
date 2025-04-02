<script setup>
// imports
import PageTop from '../components/PageTop.vue';
import LBBtn from '../components/LBBtn.vue';
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import { db } from '../js/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import InstructionsBtn from '../components/InstructionsBtn.vue';
import DarkBtn from '../components/DarkBtn.vue';

const router = useRouter();

// filtering choice
const activeBtn = ref('Past Month');
const setActive = function(label) {
  activeBtn.value = label;
  if(label === "Past Year" && !leaderboardYear.value ||
    label === "All Time" && !leaderboardAllTime.value) {
    getLeaderboard(label);
  }
}

const leaderboardMonth = ref(null);
const leaderboardYear = ref(null);
const leaderboardAllTime = ref(null);

const dataMap = reactive({
  "Past Month": leaderboardMonth,
  "Past Year": leaderboardYear,
  "All Time": leaderboardAllTime
})

const gold = ref(null);
const silver = ref(null);
const bronze = ref(null);

const loading = ref(false);
const loaded = ref(false);
// the main function
const getLeaderboard = async (timeframe = "Past Month") => {
  loaded.value = false;
  loading.value = true;
  
  const resultsRef = collection(db, "results");
  const now = new Date();
  let timeLimit;

  if (timeframe === "Past Month") {
    timeLimit = new Date(now.setDate(now.getDate() - 7));
  } else if (timeframe === "Past Year") {
    timeLimit = new Date(now.setMonth(now.getMonth() - 1));
  } else {
    timeLimit = new Date(0);
  }

  const q = query(
    resultsRef,
    where("timestamp", ">", timeLimit),
    orderBy("leaderboardScore", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    const userTopScores = new Map();
  
    querySnapshot.forEach((doc) => {
      const { username, leaderboardScore } = doc.data();
      if (!userTopScores.has(username) || userTopScores.get(username) < leaderboardScore) {
        userTopScores.set(username, leaderboardScore);
      }
    });
  
    
    const leaderboard = [...userTopScores.entries()]
    .map(([username, score]) => ({ username, leaderboardScore: score }))
    .sort((a, b) => b.leaderboardScore - a.leaderboardScore)
    .slice(0, 10); 
    
    if(timeframe === "Past Month") leaderboardMonth.value = leaderboard;
    else if(timeframe === "Past Year") leaderboardYear.value = leaderboard;
    else if(timeframe === "All Time") leaderboardAllTime.value = leaderboard;
    if(leaderboard.length) {
      gold.value = leaderboard[0].username;
    }
    if(leaderboard.length >= 2) {
      silver.value = leaderboard[1].username;
    }
    if(leaderboard.length >= 3) {
      bronze.value = leaderboard[2].username;
    }
    loaded.value = true;
  } catch(error) {
    alert("An error occurred while fetching the scores.");
    console.error(error);
    router.push('/');
  } finally {
    loading.value = false;
  }
};

// instructions
const instructions = ref(false);

// showing past month leaderboard immediately
onMounted(() => {
  getLeaderboard("Past Month");
})

// cleaning up
onUnmounted(() => {
  leaderboardMonth.value = null;
  leaderboardYear.value = null;
  leaderboardAllTime.value = null;
  loading.value = false;
  loaded.value = false;
})
</script>

<template>
    <PageTop>Leaderboard</PageTop>
    <div class="flex justify-between mx-32 mt-24 max-xl:mx-16 max-lg:mx-4">
        <LBBtn
      v-for="label in ['Past Month', 'Past Year', 'All Time']"
      :key="label"
      :class="activeBtn === label ? 'active' : 'passive', loading ? 'disabled': ''"
      @click="setActive(label)"
    >
      {{ label }}
    </LBBtn>
    </div>

    <InstructionsBtn @click="instructions = true"></InstructionsBtn>
    <div v-show="instructions">
      <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-95"></div>
      <div class="fixed top-0 left-0 w-full h-[90vh] overflow-y-auto text-brand mt-16 px-32 max-md:px-4 container">
        <h1 class="text-3xl text-center title">How are scores calculated?</h1>
        <p class="text-2xl mt-16 textInstructions">Scores take into account the type of quiz, difficulty and score of that particular quiz. That score is multiplied with two factors that reward good results on harder quizzes.<br><br>Timed and Manual Input quizzes give you 1.3x score. This represents the first factor.<br><br>The second factor comes from difficulty. Very easy difficulty gives you 1.3x score, easy gives 1.6x, normal gives 1.9x, hard gives 2.2x, very hard gives 2.5x, and absolute madman gives 2.8x.<br><br>The highest possible score is 100 x 1.3 x 2.8 = 364. The lowest possible score is 0.<br><br>Life expectancy scores are "nerfed" because they are relatively easier than the rest, so they are multiplied by 0.65.<br><br>Only one score per user can appear on the leaderboard, so your highest score for the chosen period (month/year/all-time) is displayed.</p>
        <div class="flex justify-center">
          <DarkBtn @click="instructions = false" class="mt-16 ">Close</DarkBtn>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center mt-28 text-3xl text-brand font-bold">
      Loading...
    </div>

    <div v-if="loaded" class="mt-24 px-[30%] flex flex-col gap-4 text-xl xl:text-2xl 2xl:text-3xl text-brand font-bold">
      <div v-for="user in dataMap[activeBtn]" class="flex justify-between" :class="{'text-[#ffd700]': gold === user.username, 'text-[#c0c0c0]' : silver === user.username, '#cd7f32': bronze === user.username}">
        <p>{{ user.username }}:</p>
        <p>{{ user.leaderboardScore }}</p>
      </div>
    </div>

</template>

<style scoped>
.active {
  color: var(--bg);
  background-color: var(--brand);
}
@media (max-width:640px) {
  .textInstructions {
    font-size: 1.25rem;
    line-height: 1.75rem;
    margin-top: 3rem;
  }
  .container {
    margin-top: 3rem;
  }
}
@media (max-width: 640px) and (max-height: 700px) {
  .textInstructions {
    font-size: 1.125rem;
    line-height: 1.75rem;
    margin-top: 2rem;
  }
  .title {
    font-size: 1.5rem;
    line-height: 2rem;
    padding: 0 1rem;
  }
  .container {
    margin-top: 2rem;
  }
}
</style>