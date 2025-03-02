<script setup>
// imports
import { ref, reactive } from 'vue';
import DarkBtn from '../components/DarkBtn.vue';
import { useStoreAuth } from '../stores/storeAuth';

// popup warning
const popup = ref(true);
const closePopup = function() {
    popup.value = false;
}
//////////////
// signup ////
//////////////
const validatePassword = function(password, message = false) {
    if(password.length < 8 || password.length > 20) {
        if(message) alert('Password must be between 8 and 20 characters long.');
        return false
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
        
        if(uppercase && lowercase && number && specialChar) return true;
    }
    
    if(!uppercase) {
        if(message) alert('Password must contain at least one uppercase letter.');
        return false;
    } 
    if(!lowercase) {
        if(message) alert('Password must contain at least one lowercase letter.');
        return false;
    }
    if(!number) {
        if(message) alert('Password must contain at least one number.');
        return false;
    }
    if(!specialChar) {
        if(message) alert('Password must contain at least one special character.');
        return false;
    }
    if(password.length < 8 || password.length > 20) return false;
    return true;
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

// emoticon management
// email
const emailGood = ref(false);
const checkEmail = function() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(regex.test(credentials.email)) {
        emailGood.value = true;
        return true;
    }
    else {
        emailGood.value = false;
        return false;
    }
}

// confirm email
const emailConfirm = ref(false);
const checkEmailConfirm = function() {
    emailConfirm.value = credentialsCheck.email === credentials.email && checkEmail();
}

// password
const passwordGood = ref(false);
const checkPassword = function() {
    passwordGood.value = validatePassword(credentials.password);
}

// confirm password
const passwordConfirm = ref(false);
const checkPasswordConfirm = function() {
    passwordConfirm.value = credentials.password === credentialsCheck.password && passwordGood.value;
}

// valid username
const usernameGood = ref(false);
const checkUsername = function() {
    usernameGood.value = credentials.username.length >= 5 && credentials.username.length <= 25 && !credentials.username.includes('@');
}

// authentication
const storeAuth = useStoreAuth();

// submit
const onSubmit = function() {
    if(!emailConfirm.value) {
        alert('Email addresses must match.');
    } else if(!passwordGood.value) {
        validatePassword(credentials.password, true);
    } else if(!passwordConfirm.value) {
        alert('Passwords must match.');
    } else if(!usernameGood.value) {
        alert("Username must be between 5 and 25 characters, and can't include '@'.");

    // all checks past --> register user
    } else {
        storeAuth.registerUser(credentials);
    }
}
</script>

<template>
    <!-- popup -->
    <div v-if="popup" class="fixed top-1/2 transform -translate-y-1/2 left-1/2 -translate-x-1/2 bg-bgpopup w-96 h-96 z-10 rounded-2xl border border-brand flex flex-col items-center justify-center">
        <div class="px-12 pb-6 text-lg text-brand">
            <h1 class="flex justify-center text-2xl font-bold mb-2">Note:</h1> 
            <p>- <b><i>Password</i></b> should be between <b>8</b> and <b>20</b> characters and contain at least one <b>uppercase</b> letter, one <b>lowercase</b> letter, one <b>number</b> and one <b>special character</b> </p>
            <p>- <b><i>Username</i></b> should be between <b>5</b> and <b>25</b> characters, and <b>cannot</b> contain <b>@</b></p>
        </div>
        <DarkBtn @click="closePopup">Ok</DarkBtn>
    </div>

    <!-- signup -->
    <div class="h-auto w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 flex flex-col my-4">
        <h1 class="text-center text-4xl font-bold text-brand mt-6">Sign Up</h1>
        <p class="text-center text-brand mt-6">Sign up to save your results!</p>
        <form @submit.prevent="onSubmit" class="mt-6 mx-4 md:grid lg:grid-cols-7 gap-x-4 gap-y-6 items-center">
            <label for="username" class="labelForm">Username:</label>
            <input v-model="credentials.username" @input="checkUsername" name="username" type="text" placeholder="Choose a username" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!usernameGood" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="email" class="labelForm">Email:</label>
            <input v-model="credentials.email" @input="checkEmail" name="email" type="email" placeholder="Enter your email address" 
                class="inputForm" required>
            <div class="emoticon">
                <img v-if="!emailGood" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else src="../assets/images/green.png" alt="green, smiley face">
            </div>
            
            <label for="confirmEmail" class="labelForm">Confirm Email:</label>
            <input v-model="credentialsCheck.email" @input="checkEmailConfirm" name="confirmEmail" type="email" @paste="event => event.preventDefault()" placeholder="Re-enter your email address" 
                class="inputForm" required>
            <div class="emoticon">
                <img v-if="!emailConfirm" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="password" class="labelForm">Password:</label>
            <input v-model="credentials.password" @input="checkPassword" name="password" type="password" placeholder="Create a password" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!passwordGood" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="confirmPassword" class="labelForm">Confirm Password:</label>
            <input v-model="credentialsCheck.password" @input="checkPasswordConfirm" name="confirmPassword" type="password" @paste="event => event.preventDefault()" placeholder="Re-enter your password" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!passwordConfirm" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-7 mx-auto text-xl font-medium max-lg:block max-lg:mt-4 hover:bg-bgbtn hover:text-wg hover:border-brand active:scale-98">Sign Up!</button>
        </form>

        <h2 class="mx-auto text-2xl text-brand mt-12 max-lg:block max-lg:mt-8">Or sign up with:</h2>

        <button class="altSignUp group" @click="storeAuth.signInWithGoogle()">
            <img src="../assets/images/google.png" alt="google logo" class="logo">
            <span class="logoName">Google</span>
        </button>

        <router-link :to="{name: 'home'}"><button class="w-32 h-12 bg-bgbtn border-2 border-brand mt-10 mx-auto rounded-full text-wg text-xl mb-4 max-lg:block hover:bg-brand hover:border-bg hover:text-bg active:scale-98">Quit</button></router-link>
        
    </div>
</template>

<style scoped>
.labelForm {
    font-size: 1.5rem;
    color: var(--brand);
    text-align: center;
    padding-right: 1rem;
}
@media (max-width: 768px) {
    .labelForm {
        display: block;
        margin-top: 0.5rem;
    }
}
@media (min-width: 768px) {
    .labelForm {
        grid-column: span 2;
    }
}

.inputForm {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    border: 1px solid var(--brand);
    transition: box-shadow 0.2s ease-in-out; 
}
.inputForm:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--brand);
}
@media (min-width: 768px) {
    .inputForm {
        grid-column: span 4;
    }
}
@media (max-width: 768px) {
    .inputForm {
        display: block;
    }
}

.emoticon {
    display: none;
}
@media (min-width: 768px) {
    .emoticon {
        display: block;
        width: 2.5rem;
    }
}

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
</style>