<script setup>
// imports
import DarkBtn from './DarkBtn.vue';
import { useRouter } from 'vue-router';
import { useStoreStudy } from '../stores/storeStudy';

// props
const props = defineProps(['label']);

// declaring the router
const router = useRouter();

// sending the choice information
const storeStudy = useStoreStudy();
const whatToDo = () => {
    const topic = props.label.replace(/\n/g, ' ');
    const urlValue = storeStudy.choiceMap[topic];
    if(router.currentRoute.value.fullPath === "/study-choice") {
        router.push({name: 'study', params: {choice: urlValue}});
    } else if (router.currentRoute.value.fullPath.includes('/quiz-choice')) {
        router.push({name: 'quiz-difficulty-choice', params: {type: storeStudy.typesMap[storeStudy.type], choice: urlValue}});
    }
}
</script>

<template>
    <DarkBtn @click="whatToDo" class="w-56 h-14">
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>