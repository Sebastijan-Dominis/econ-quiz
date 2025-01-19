<script>
    export default {
        name: 'Signup'
    }
</script>

<template>
    <div class="h-auto w-auto bg-bgform border-brand border-4 rounded-3xl absolute left-1/2 transform -translate-x-1/2 flex flex-col my-4">
        <h1 class="text-center text-4xl font-bold text-brand mt-6">Sign Up</h1>
        <p class="text-center text-brand mt-6">Sign up to save your results!</p>
        <form class="mt-6 mx-4 lg:grid lg:grid-cols-3 gap-x-4 gap-y-6 items-center">
            <label for="email" class="text-2xl text-brand text-center pr-4 max-lg:block">Email:</label>
            <input name="email" type="email" placeholder="Enter your email address..." 
                class="lg:col-span-2 px-4 py-2 rounded-full border border-brand focus:ring-2 focus:ring-brand max-lg:block">
            
            <label for="confirmEmail" class="text-2xl text-brand text-center pr-4 max-lg:block max-lg:mt-2">Confirm Email:</label>
            <input name="confirmEmail" type="email" placeholder="Emails need to match..." 
                class="lg:col-span-2 px-4 py-2 rounded-full border border-brand focus:ring-2 focus:ring-brand max-lg:block">

            <label for="password" class="text-2xl text-brand text-center pr-4 max-lg:block max-lg:mt-2">Password:</label>
            <div class="lg:col-span-2 flex items-center gap-2">
                <input name="password" type="password" placeholder="Choose a password..." 
                    class="flex-1 px-4 py-2 rounded-full border border-brand focus:ring-2 focus:ring-brand max-lg:block">
            </div>

            <label for="confirmPassword" class="text-2xl text-brand text-center pr-4 max-lg:block max-lg:mt-2">Confirm Password:</label>
            <div class="lg:col-span-2 flex items-center gap-2">
                <input name="confirmPassword" type="password" placeholder="Passwords need to match..." 
                    class="flex-1 px-4 py-2 rounded-full border border-brand focus:ring-2 focus:ring-brand max-lg:block">
            </div>

            <label for="username" class="text-2xl text-brand text-center pr-4 max-lg:block max-lg:mt-2">Enter Username:</label>
            <div class="lg:col-span-2 flex items-center gap-2">
                <input name="username" type="text" placeholder="This is how you will appear to the other users..." 
                    class="flex-1 px-4 py-2 rounded-full border border-brand focus:ring-2 focus:ring-brand max-lg:block">
            </div>

            <button type="submit" class="w-36 h-14 border-bg border-2 bg-brand text-bg rounded-full col-span-3 mx-auto text-xl font-medium max-lg:block max-lg:mt-4 hover:bg-bgbtn hover:text-wg hover:border-brand active:scale-98">Sign Up!</button>
        </form>

        <h2 class="mx-auto text-2xl text-brand mt-12 max-lg:block max-lg:mt-8">Or sign up with:</h2>

        <button class="flex items-center justify-center w-56 h-14 bg-bgbtn border-brand border-2 rounded-full space-x-12 mt-4 mx-auto hover:bg-brand hover:border-bg active:scale-98 group">
            <img src="../assets/images/google.png" alt="google logo" class="w-10 h-auto">
            <span class="text-xl text-wg group-hover:text-bg">Google</span>
        </button>
        <button class="flex items-center justify-center w-56 h-14 bg-bgbtn border-brand border-2 rounded-full space-x-12 mt-4 mx-auto hover:bg-brand hover:border-bg active:scale-98 group">
            <img src="../assets/images/facebook.png" alt="google logo" class="w-10 h-auto">
            <span class="text-xl text-wg group-hover:text-bg">Facebook</span>
        </button>

        <button @click="this.$router.back()" class="w-32 h-12 bg-bgbtn border-2 border-brand mt-10 mx-auto rounded-full text-wg text-xl mb-4 max-lg:block hover:bg-brand hover:border-bg hover:text-bg active:scale-98">Quit</button>
    </div>
</template>