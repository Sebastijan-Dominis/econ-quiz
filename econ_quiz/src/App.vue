<script setup>
// imports
import { ref, onMounted, onUnmounted } from 'vue';
import musicFile from '../src/assets/music/chillLofiMusic.mp3';
import { useStoreAuth } from './stores/storeAuth';
import { useStoreStudy } from './stores/storeStudy';
import { useStoreFAQ } from './stores/storeFAQ';

// music
const audio = ref(null);
const playing = ref(false);
onMounted(() => {
  audio.value = new Audio(musicFile);
  audio.value.loop = true;
})
onUnmounted(() => {
  audio.value.pause();
  audio.value.currentTime = 0;
})
const toggleAudio = function() {
  if(!audio.value) return;
  if(audio.value.paused) {
    audio.value.play();
    playing.value = true;
  }
  else {
    audio.value.pause();
    playing.value = false;
  }
}

// auth state management
const storeAuth = useStoreAuth();
onMounted(() => {
  storeAuth.init();
})

// getting the quiz information
const storeStudy = useStoreStudy();
onMounted(() => {
  storeStudy.fetchQuizInfo();
})

// getting the FAQs
const storeFAQ = useStoreFAQ();
onMounted(() => {
  storeFAQ.fetchFAQ();
})
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Background Image -->
    <img src="../src/assets/images/background.jpg" class="fixed top-0 left-0 w-full h-full object-cover z-[-3]" alt="background image showing a map of the world with some pins and money"/>
    <!-- Semi-Transparent Overlay -->
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-85 z-[-2]"></div>
    <router-view></router-view>

    <!-- relaxing music -->
    <div @click="toggleAudio" class="fixed top-80 left-0 mx-4 px-4 py-2 md:w-16 bg-bgbtn border border-brand border-2 rounded-lg cursor-pointer max-md:px-2 max-md:py-1">
      <button class="flex justify-between items-center w-full">
        <img v-if="!playing" src="/src/assets/icons/speakerOff.svg" alt="music off" class="max-md:w-6 max-md:h-auto">
        <img v-else src="/src/assets/icons/speakerOn.svg" alt="music on" class="max-md:w-6 max-md:h-auto">
      </button>
    </div>
  </div>
</template>