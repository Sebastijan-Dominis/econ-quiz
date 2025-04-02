<script setup>
// imports
import { reactive } from 'vue';
import { useStoreAuth } from '../stores/storeAuth';
import ReturnBtn from '../components/ReturnBtn.vue';

const storeAuth = useStoreAuth();

const credentials = reactive({
    email: "",
    password: ""
})
</script>

<template>
    <ReturnBtn class="fixed left-0 top-0 z-50"></ReturnBtn>

    <div class="h-auto w-auto md:w-[70vw] lg:w-auto px-4 py-2 bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col">
        <h1 class="text-center text-4xl font-bold text-brand mt-4 px-2">Resend verification email</h1>
        <p class="text-center text-brand mt-6">Verify your email to log in!</p>
        <form @submit.prevent="storeAuth.resendVerificationEmail(credentials)" class="mt-6 mx-4 md:grid md:grid-cols-3 gap-x-4 gap-y-6 items-center">
            <label for="email" class="labelForm">Email: </label>
            <input name="email" type="text" placeholder="Enter your email" v-model="credentials.email" class="inputForm" required>
            
            <label for="password" class="labelForm">Password: </label>
            <input name="password" type="password" placeholder="Enter your password..." v-model="credentials.password" class="inputForm" required>

            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-3 mx-auto text-xl font-medium max-lg:block lg:hover:bg-bgbtn lg:hover:border-brand lg:hover:text-wg lg:active:scale-98 max-md:mt-4 mb-4">Resend!</button>
        </form>
    </div>

    <p class="text-brand fixed left-1/2 -translate-x-[50%] bottom-2 text-sm text-center md:bottom-8 md:text-base">Note:<br>Google accounts are automatically verified</p>
</template>