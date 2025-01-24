<script>
    import DarkBtn from '../components/DarkBtn.vue';
    import PageTop from '../components/PageTop.vue';

    export default {
        name: 'ResultsChoice',
        components: {
            DarkBtn,
            PageTop,
        }
    }
</script>

<template>
    <PageTop>Results</PageTop>
    <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Browse your past results by category</h2>
    <div class="grid md:grid-cols-2 place-items-center md:mx-16 lg:mx-36 xl:mx-48 2xl:mx-80 gap-12 md:gap-16 lg:gap-24 lg:gap-32 xl:gap-40 2xl:gap-48 mt-8 md:mt-16 lg:mt-24 xl:mt-32 2xl:mt-40">
        <router-link to="results"><DarkBtn class="indicators">Economic<br>Indicators</DarkBtn></router-link>
        <router-link to="results"><DarkBtn class="indicators">Demographic<br>Indicators</DarkBtn></router-link>
        <router-link to="results"><DarkBtn class="indicators">Other<br>Indicators</DarkBtn></router-link>
       <router-link to="results"><DarkBtn class="indicators">All</DarkBtn></router-link>
    </div>
</template>

<style scoped>
    .indicators {
        height: 128px;
        width: 320px;
        font-size: 30px;
    }
    @media (max-width: 1280px) {
        .indicators {
            height: 112px;
            width: 288px;
            font-size: 24px;
        }
    }
    @media (max-width: 1024px) {
        .indicators {
            height: 96px;
            width: 256px;
            font-size: 20px;
        }
    }

</style>