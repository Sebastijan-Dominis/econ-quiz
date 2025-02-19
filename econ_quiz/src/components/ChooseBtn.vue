<script setup>
// components
import DarkBtn from './DarkBtn.vue';

// imports
import { useRouter } from 'vue-router';

// props
const props = defineProps(['label']);

// declaring the router
const router = useRouter();

// sending the choice information
const whatToDo = () => {
    console.log(router.currentRoute.value.fullPath)
    if(router.currentRoute.value.fullPath === "/study-choice") {
        router.push({name: 'study', params: {choice: props.label}})
    } else if (router.currentRoute.value.fullPath === "/quiz-choice") {
        router.push({name: 'home'})
    }
}
</script>

<template>
    <DarkBtn @click="whatToDo" class="w-56 h-14">
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>