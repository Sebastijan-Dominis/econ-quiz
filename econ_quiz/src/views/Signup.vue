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
    <div v-if="popup" class="fixed top-1/2 transform -translate-y-[50%] left-1/2 -translate-x-[50%] bg-bgpopup w-80 h-[400px] md:w-96 z-10 rounded-2xl border border-2 border-brand flex flex-col items-center justify-center">
        <div class="px-12 pb-6 md:text-lg text-brand">
            <h1 class="flex justify-center text-xl md:text-2xl font-bold mb-2">Note:</h1> 
            <p>- <b><i>Password</i></b> should be between <b>8</b> and <b>20</b> characters and contain at least one <b>uppercase</b> letter, one <b>lowercase</b> letter, one <b>number</b> and one <b>special character</b> </p>
            <p>- <b><i>Username</i></b> should be between <b>5</b> and <b>25</b> characters, and <b>cannot</b> contain <b>@</b></p>
        </div>
        <DarkBtn @click="closePopup">Ok</DarkBtn>
    </div>

    <!-- signup -->
    <div class="h-auto w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col mainContainer">
        <h1 class="text-center text-4xl font-bold text-brand mt-6 title">Sign Up</h1>
        <p class="text-center text-brand mt-6 subtitle">Sign up to save your results!</p>
        <form @submit.prevent="onSubmit" class="mt-6 mx-4 md:grid lg:grid-cols-7 gap-x-4 gap-y-6 items-center formContainer">
            <label for="username" class="labelForm">Username:</label>
            <input v-model="credentials.username" @input="checkUsername" name="username" type="text" placeholder="Choose a username" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!usernameGood" class="emoticon" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else class="emoticon" src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="email" class="labelForm">Email:</label>
            <input v-model="credentials.email" @input="checkEmail" name="email" type="email" placeholder="Enter your email address" 
                class="inputForm" required>
            <div class="emoticon">
                <img v-if="!emailGood" class="emoticon" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else class="emoticon" src="../assets/images/green.png" alt="green, smiley face">
            </div>
            
            <label for="confirmEmail" class="labelForm">Confirm Email:</label>
            <input v-model="credentialsCheck.email" @input="checkEmailConfirm" name="confirmEmail" type="email" @paste="event => event.preventDefault()" placeholder="Re-enter your email address" 
                class="inputForm" required>
            <div class="emoticon">
                <img v-if="!emailConfirm" class="emoticon" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else class="emoticon" src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="password" class="labelForm">Password:</label>
            <input v-model="credentials.password" @input="checkPassword" name="password" type="password" placeholder="Create a password" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!passwordGood" class="emoticon" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else class="emoticon" src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <label for="confirmPassword" class="labelForm">Confirm Password:</label>
            <input v-model="credentialsCheck.password" @input="checkPasswordConfirm" name="confirmPassword" type="password" @paste="event => event.preventDefault()" placeholder="Re-enter your password" 
            class="inputForm" required>
            <div class="emoticon">
                <img v-if="!passwordConfirm" class="emoticon" src="../assets/images/red.png" alt="red, frowny face">
                <img v-else class="emoticon" src="../assets/images/green.png" alt="green, smiley face">
            </div>

            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-7 mx-auto text-xl font-medium max-lg:block max-lg:mt-4 lg:hover:bg-bgbtn lg:hover:text-wg lg:hover:border-brand lg:active:scale-98 signupBtn">Sign Up!</button>
        </form>

        <h2 class="mx-auto text-2xl text-brand mt-12 max-lg:block max-lg:mt-8 secondSubtitle">Or sign up with:</h2>

        <button class="altSignUp group" @click="storeAuth.signInWithGoogle()">
            <img src="../assets/images/google.png" alt="google logo" class="logo">
            <span class="logoName">Google</span>
        </button>

        <router-link :to="{name: 'home'}"><button class="w-32 h-12 bg-bgbtn border-2 border-brand mt-10 mx-auto rounded-full text-wg text-xl mb-4 block lg:hover:bg-brand lg:hover:border-bg lg:hover:text-bg ;lg:active:scale-98 quitBtn">Quit</button></router-link>
        
    </div>
</template>

<style scoped>
/* basics */
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
@media (min-width: 1024px) {
    .altSignUp:hover {
        background-color: var(--brand);
        border-color: var(--bg);
    }
    .altSignUp:active {
        transform: scale(0.98);
    }
    .group:hover .logoName {
        color: var(--bg);
    }
}
.logo {
    width: 2.5rem;
    height: auto;
}

.logoName {
    font-size: 20px;
    color: var(--wg);
}


/* large mobile phones */
@media (max-width: 640px) {
    .title {
        font-size: 1.875rem;
        line-height: 2.25rem;
        margin-top: 1rem;
    }
    .subtitle {
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 1rem;
    }
    .formContainer {
        margin-top: 1rem;
    }
    .labelForm {
        font-size: 1.25rem;
        line-height: 1.75rem;
        margin-top: 0.25rem;
    }
    .inputForm {
        padding: 0.4rem 0.8rem;
    }
    .signupBtn {
        height: 3rem;
        width: 7.5rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
    .secondSubtitle {
        font-size: 1.25rem;
        line-height: 1.75rem;
        margin-top: 1rem;
    }
    .altSignUp {
        height: 3rem;
        width: 11rem;
    }
    .logo {
        width: 1.75rem;
    }
    .logoName {
        font-size: 1.125rem;
        line-height: 1.75rem;
    }
    .quitBtn {
        height: 3rem;
        width: 7rem;
        font-size: 1rem;
        line-height: 1.5rem;
        margin-top: 1.75rem;
    }
    .mainContainer {
        width: 80vw;
    }
    .inputForm {
        width: 70vw;
    }
}

/* small to mid-size mobile phones exceptions from above and small screen height */
@media ((max-width: 640px) and (max-height: 800px)) or (max-height: 850px) {
    .title {
        font-size: 1.5rem;
        line-height: 2rem;
        margin-top: 0.75rem;
    }
    .subtitle {
        font-size: 0.75rem;
        line-height: 1rem;
        margin-top: 0.75rem;
    }
    .formContainer {
        margin-top: 0.75rem;
    }
    .labelForm {
        font-size: 1.125rem;
        line-height: 1.75rem;
        margin-top: 0.15rem;
    }
    .inputForm {
        padding: 0.3rem 0.6rem;
    }
    .signupBtn {
        height: 2.5rem;
        width: 6.5rem;
        font-size: 1rem;
        line-height: 1.5rem;
    }
    .secondSubtitle {
        font-size: 1.125rem;
        line-height: 1.75rem;
        margin-top: 0.75rem;
    }
    .altSignUp {
        height: 2.5rem;
        width: 9rem;
    }
    .logo {
        width: 1.25rem;
    }
    .logoName {
        font-size: 1rem;
        line-height: 1.5rem;
    }
    .quitBtn {
        height: 2.5rem;
        width: 6rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 1.5rem;
    }
    .emoticon {
        width: 2rem;
    }
}

/* very small screen height, like nesthub */
@media (max-height: 780px) {
        .title {
        font-size: 1.25rem;
        line-height: 1.75rem;
        margin-top: 0.5rem;
    }
    .subtitle {
        font-size: 0.75rem;
        line-height: 1rem;
        margin-top: 0.5rem;
    }
    .formContainer {
        margin-top: 0.5rem;
    }
    .labelForm {
        font-size: 1rem;
        line-height: 1.5rem;
        margin-top: 0.1rem;
    }
    .inputForm {
        padding: 0.2rem 0.4rem;
    }
    .signupBtn {
        height: 2rem;
        width: 5.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
    .secondSubtitle {
        font-size: 1rem;
        line-height: 1.5rem;
        margin-top: 0.5rem;
    }
    .altSignUp {
        gap: 2rem;
        height: 2rem;
        width: 7.5rem;
    }
    .logo {
        width: 1rem;
    }
    .logoName {
        font-size: 0.875rem;
        line-height: 1.25rem;
    }
    .quitBtn {
        height: 2rem;
        width: 5rem;
        font-size: 0.75rem;
        line-height: 1rem;
        margin-top: 1rem;
    }
    .emoticon {
        width: 1.5rem;
    }
}

</style>