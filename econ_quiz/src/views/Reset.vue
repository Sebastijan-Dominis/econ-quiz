<script setup>
// imports
import { useStoreAuth } from '../stores/storeAuth';
import { ref } from 'vue';
import ReturnBtn from '../components/ReturnBtn.vue';

const storeAuth = useStoreAuth();
const email = ref("");
</script>

<template>
    <ReturnBtn class="fixed left-0 top-0 z-50"></ReturnBtn>

    <div class="h-auto w-auto md:px-2 md:py-2 bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col">
        <h1 class="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-brand md:mt-2">Password reset</h1>
        <p class="text-center text-brand mt-2 md:mt-4 md:mt-6 text-sm md:text-base">Reset your password!</p>
        <form @submit.prevent="storeAuth.resetPassword(email)" class="md:mt-2 lg:mt-6 mx-2 md:mx-4 md:grid md:grid-cols-3 gap-x-4 gap-y-6 items-center">
            <label for="email" class="labelForm max-md:text-xl">Email: </label>
            <input name="email" type="text" placeholder="Enter your email" v-model="email" class="inputForm max-md:px-2 max-md:py-1" required>

            <button type="submit" class="w-28 h-12 md:w-36 md:h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-3 mx-auto text-lg md:text-xl font-medium max-lg:block lg:hover:bg-bgbtn lg:hover:border-brand lg:hover:text-wg lg:active:scale-98 max-md:mt-4 mb-2 md:mb-4">Reset!</button>
        </form>
    </div>
</template>