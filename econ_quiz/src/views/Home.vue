<script>
    import BrandBtn from '../components/BrandBtn.vue';
    import DarkBtn from '../components/DarkBtn.vue';

    export default {
        name: 'Home',
        components: {
            BrandBtn,
            DarkBtn
        }
    }
</script>

<template>
    <nav class="flex justify-between items-center px-10 py-6">
        <div class="flex gap-4">
            <DarkBtn>Results</DarkBtn>
            <DarkBtn>Leaderboard</DarkBtn>
            <DarkBtn>Study</DarkBtn>
        </div>

        <div class="flex gap-4">
            <DarkBtn>Login</DarkBtn>
            <BrandBtn>Sign Up</BrandBtn>
        </div>
    </nav>

    <p class="absolute left-1/2 top-40 text-brand text-3xl transform -translate-x-1/2 text-center font-normal">You are not logged in. Log in to<br>save your results!</p>
</template>