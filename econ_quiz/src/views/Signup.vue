<script setup>
// imports
import { reactive } from 'vue';
import {useBack} from '../composables/useBack';

// getting the back function
const {back} = useBack();

// submit
const onSubmit = function() {
    if(credentials.email !== credentialsCheck.email) {
        alert('Email addresses must match.');
    } 
    validatePassword();
    if(credentials.password !== credentialsCheck.password) {
        alert('Passwords must match.');
    } 
    if(credentials.username.length <= 5 || credentials.username.length >= 25) {
        alert('Username must be between 5 and 25 characters long.');
    }
}

const validatePassword = function(password) {
    if(password.length < 8 || password.length > 20) {
        alert('Password must be between 8 and 20 characters long.');
    }

    let uppercase = false;
    let lowercase = false;
    let number = false;
    let specialChar = false;

    for(let i = 0; i < password.length; i++) {
        const charCode = password.charCodeAt(i);
        if(charCode >= 65 && charCode <= 90) uppercase = true;
        if(charCode >= 97 && charCode <=122) lowercase = true;
        if(charCode >= 48 && charCode <= 57) number = true;
        if((charCode >= 33 && charCode <= 47) || (charCode >= 58 && charCode <= 64) || (charCode >= 91 && charCode <= 96) || (charCode >= 123 && charCode <= 126)) specialChar = true;

        if(uppercase && lowercase && number && specialChar) break;
    }

    if(!uppercase) alert('Password must contain at least one uppercase letter.');
    if(!lowercase) alert('Password must contain at least one lowercase letter.');
    if(!number) alert('Password must contain at least one number.');
    if(!specialChar) alert('Password must contain at least one special character.');
}

// credentials
const credentials = reactive({
    username: '',
    email: '',
    password: ''
})
const credentialsCheck = reactive({
    email: '',
    password: ''
})
</script>

<template>
    <div class="h-auto w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 flex flex-col my-4">
        <h1 class="text-center text-4xl font-bold text-brand mt-6">Sign Up</h1>
        <p class="text-center text-brand mt-6">Sign up to save your results!</p>
        <form @submit.prevent="onSubmit" class="mt-6 mx-4 lg:grid lg:grid-cols-3 gap-x-4 gap-y-6 items-center">
            <label for="email" class="labelForm">Email:</label>
            <input v-model="credentials.email" name="email" type="email" placeholder="Enter your email address" 
                class="inputForm" required>
            
            <label for="confirmEmail" class="labelForm">Confirm Email:</label>
            <input v-model="credentialsCheck.email" name="confirmEmail" type="email" placeholder="Re-enter your email address" 
                class="inputForm" required>

            <label for="password" class="labelForm">Password:</label>
            <input v-model="credentials.password" name="password" type="password" placeholder="Create a password" 
            class="inputForm" required>


            <label for="confirmPassword" class="labelForm">Confirm Password:</label>
            <input v-model="credentialsCheck.password" name="confirmPassword" type="password" placeholder="Re-enter your password" 
            class="inputForm" required>

            <label for="username" class="labelForm">Enter Username:</label>
            <input v-model="credentials.username" name="username" type="text" placeholder="Choose a username" 
            class="inputForm" required>


            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-3 mx-auto text-xl font-medium max-lg:block max-lg:mt-4 hover:bg-bgbtn hover:text-wg hover:border-brand active:scale-98">Sign Up!</button>
        </form>

        <h2 class="mx-auto text-2xl text-brand mt-12 max-lg:block max-lg:mt-8">Or sign up with:</h2>

        <button class="altSignUp group">
            <img src="../assets/images/google.png" alt="google logo" class="logo">
            <span class="logoName">Google</span>
        </button>
        <button class="altSignUp group">
            <img src="../assets/images/facebook.png" alt="google logo" class="logo">
            <span class="logoName">Facebook</span>
        </button>

        <button @click="back" class="w-32 h-12 bg-bgbtn border-2 border-brand mt-10 mx-auto rounded-full text-wg text-xl mb-4 max-lg:block hover:bg-brand hover:border-bg hover:text-bg active:scale-98">Quit</button>
    </div>

    <!-- images -->
    <!-- <img src="../assets/images/green.png" alt="happy face" class="fixed right-64 top-40 w-16"> -->
</template>

<style scoped>
.labelForm {
    font-size: 1.5rem;
    color: #ffa550;
    text-align: center;
    padding-right: 1rem;
}
@media (max-width: 1024px) {
    .labelForm {
        display: block;
        margin-top: 0.5rem;
    }
}

.inputForm {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 1px solid var(--brand-color);
}
.inputForm:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand-color);
}
@media (min-width: 1024px) {
    .inputForm {
        grid-column: span 2;
    }
}
@media (max-width: 1024px) {
    .inputForm {
        display: block;
    }
}

.altSignUp {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14rem;
    height: 3.5rem;
    background-color: var(--bgbtn);
    border: solid 2px var(--brand-color);
    border-radius: 9999px;
    gap: 3rem;
    margin-top: 16px;
    margin-left: auto;
    margin-right: auto;
}
.altSignUp:hover {
    background-color: var(--brand-color);
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
</style>