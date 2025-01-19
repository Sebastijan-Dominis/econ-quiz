<script>
    import DarkBtn from '../components/DarkBtn.vue';
    import PageTop from '../components/PageTop.vue';

    export default {
        name: 'Results',
        components: {
            DarkBtn,
            PageTop,
        }
    }
</script>

<template>
    <PageTop>Results</PageTop>
    <h2 class="text-brand text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Browse your past results by category</h2>
    <div class="grid md:grid-cols-2 place-items-center md:mx-16 lg:mx-36 xl:mx-48 2xl:mx-80 gap-12 md:gap-16 lg:gap-24 lg:gap-32 xl:gap-40 2xl:gap-48 mt-8 md:mt-16 lg:mt-24 xl:mt-32 2xl:mt-40">
        <DarkBtn class="h-32 w-80 text-3xl">Economic<br>Indicators</DarkBtn>
        <DarkBtn class="h-32 w-80 text-3xl">Demographic<br>Indicators</DarkBtn>
        <DarkBtn class="h-32 w-80 text-3xl">Other<br>Indicators</DarkBtn>
        <DarkBtn class="h-32 w-80 text-3xl">All</DarkBtn>
    </div>
</template>