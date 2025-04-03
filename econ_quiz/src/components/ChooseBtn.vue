<script setup>
// imports
import DarkBtn from './DarkBtn.vue';
import { useRouter } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';
import { useStoreEditQuiz } from '../stores/storeEditQuiz';

// props
const props = defineProps(['label']);

// declaring the router
const router = useRouter();

// sending the choice information
const storeStudy = useStoreStudy();
const storeEditQuiz = useStoreEditQuiz();
const whatToDo = () => {
    const topic = props.label.replace(/\n/g, ' ');
    const urlValue = storeStudy.choiceMap[topic];
    if(router.currentRoute.value.fullPath === "/study-choice") {
        router.push({name: 'study', params: {choice: urlValue}});
    } else if (router.currentRoute.value.fullPath.includes('/quiz-choice')) {
        router.push({name: 'quiz-difficulty-choice', params: {type: storeStudy.typesMap[storeStudy.type], choice: urlValue}});
    } else if (router.currentRoute.value.fullPath === "/edit-choice") {
        storeEditQuiz.editOrDelete = true;
        storeEditQuiz.chosenTopic = topic;
    }
}
</script>

<template>
    <DarkBtn @click="whatToDo" class="w-56 h-14 2xl:w-64 2xl:h-16 chooseBtn">
        <span class="mx-4 block text-center whitespace-pre-line 2xl:text-lg chooseText">{{ label }}</span>
    </DarkBtn>
</template>

<style>
@media (min-width: 1280px) and (max-height: 940px) {
    .chooseBtn {
        width: 14rem;
        height: 3.5rem;
    }
    .chooseText {
        font-size: 1rem;
        line-height: 1.5rem;
    }
}
</style>