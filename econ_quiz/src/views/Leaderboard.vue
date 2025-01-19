<script>
    import ReturnBtn from '../components/ReturnBtn.vue';

    export default {
        name: 'Leaderboard',
        components: {
            ReturnBtn
        }
    }
</script>

<template>
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
    <ReturnBtn @click="this.$router.back()"></ReturnBtn>
    <h1 class="text-brand text-6xl justify-self-center">Leaderboard</h1>
</template>