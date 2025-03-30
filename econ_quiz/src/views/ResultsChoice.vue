<script setup>
// imports
import DarkBtn from '../components/DarkBtn.vue';
import PageTop from '../components/PageTop.vue';
</script>

<template>
    <PageTop>Results</PageTop>
    <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center smallestTitle">Browse your past results by category</h2>
    <div class="flex flex-col justify-center max-md:h-[54vh] items-center md:grid md:grid-cols-2 md:place-items-center md:mx-16 lg:mx-36 xl:mx-48 2xl:mx-80 gap-12 md:gap-16 lg:gap-24 lg:gap-32 xl:gap-40 2xl:gap-48 mt-8 md:mt-16 lg:mt-24 xl:mt-32 2xl:mt-40 smallestBtns">
        <router-link :to="{name: 'results'}"><DarkBtn class="indicators">Economic<br>Indicators</DarkBtn></router-link>
        <router-link :to="{name: 'results'}"><DarkBtn class="indicators">Demographic<br>Indicators</DarkBtn></router-link>
        <router-link :to="{name: 'results'}"><DarkBtn class="indicators">Other<br>Indicators</DarkBtn></router-link>
       <router-link :to="{name: 'results'}"><DarkBtn class="indicators">All</DarkBtn></router-link>
    </div>
</template>

<style scoped>
    .indicators {
        height: 8rem;
        width: 20rem;
        font-size: 1.875rem;
        line-height: 2.25rem;
    }
    @media (max-width: 1280px) {
        .indicators {
            height: 7rem;
            width: 18rem;
            font-size: 1.5rem;
            line-height: 2rem;
        }
    }
    @media (max-width: 1024px) {
        .indicators {
            height: 6rem;
            width: 16rem;
            font-size: 1.25rem;
            line-height: 1.75rem;
        }
    }
    @media (max-width: 640px) {
        .indicators {
            height: 4rem;
            width: 11rem;
            font-size: 1rem;
            line-height: 1.5rem;
        }
    }
    @media (max-width: 640px) and (max-height: 700px) {
        .indicators {
            height: 3rem;
            width: 9rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
        }
        .smallestBtns {
            height: 45vh;
        }
        .smallestTitle {
            font-size: 1.25rem;
            line-height: 1.75rem;
            margin-top: 3rem;
        }
    }
</style>