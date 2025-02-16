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
const whatToStudy = () => {
    router.push({name: 'study', params: {choice: props.label}})
}
</script>

<template>
    <DarkBtn @click="whatToStudy" class="w-56 h-14">
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>