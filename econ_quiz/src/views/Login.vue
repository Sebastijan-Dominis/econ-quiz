<script setup>
// imports
import { reactive } from 'vue';
import { useStoreAuth } from '../stores/storeAuth';
import { RouterLink } from 'vue-router';

///////////
// login //
///////////
const credentials = reactive({
    identifier: "",
    password: ""
})
const storeAuth = useStoreAuth();
</script>

<template>
    <div class="h-auto w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col">
        <h1 class="text-center text-4xl font-bold text-brand mt-6">Login</h1>
        <p class="text-center text-brand mt-6">Log back in to your account!</p>
        <form @submit.prevent="storeAuth.loginUser(credentials)" class="mt-6 mx-4 md:grid md:grid-cols-3 gap-x-4 gap-y-6 items-center">
            <label for="email" class="labelForm">Email or Username:</label>
            <input name="email" type="text" placeholder="Enter your email or username" v-model="credentials.identifier" class="inputForm" required>
            
            <label for="password" class="labelForm">Password: </label>
            <input name="password" type="password" placeholder="Enter your password" v-model="credentials.password" class="inputForm" required>

            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-3 mx-auto text-xl font-medium max-lg:block hover:bg-bgbtn hover:border-brand hover:text-wg active:scale-98 max-md:mt-4">Log In!</button>
        </form>

        <h2 class="mx-auto text-2xl text-brand mt-6 max-lg:block">Or log in with:</h2>

        <button class="altSignUp group" @click="storeAuth.signInWithGoogle()">
            <img src="../assets/images/google.png" alt="google logo" class="logo">
            <span class="logoName">Google</span>
        </button>

        <div class="flex justify-center gap-4 mt-12 items-center max-md:flex-col">
            <router-link :to="{name: 'resend'}"><button class="help">Resend verification email</button></router-link>
            <router-link :to="{name: 'reset'}"><button class="help">I forgot my password</button></router-link>
        </div>
        <router-link :to="{name: 'home'}"><button class="w-32 h-12 bg-bgbtn border-2 border-brand mt-4 mx-auto rounded-full text-wg text-xl mb-4 block hover:bg-brand hover:border-bg hover:text-bg active:scale-98">Quit</button></router-link>
    </div>
</template>

<style scoped>
.altSignUp {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    height: 3.5rem;
    background-color: var(--bgbtn);
    border: solid 2px var(--brand);
    border-radius: 9999px;
    gap: 3rem;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
}
.altSignUp:hover {
    background-color: var(--brand);
    border-color: var(--bg);
}
.altSignUp:active {
    transform: scale(0.98);
}

.logo {
    width: 2.5rem;
    height: auto;
}

.logoName {
    font-size: 20px;
    color: var(--wg);
}
.group:hover .logoName {
    color: var(--bg);
}

.help {
    width: 12rem;
    height: 3.5rem;
    background-color: var(--bgbtn);
    border: solid 2px var(--brand);
    color: var(--wg);
    border-radius: 9999px;
}
.help:hover {
    background-color: var(--brand);
    border-color: var(--bg);
    color: var(--bg);
}
</style>