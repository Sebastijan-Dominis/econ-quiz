<script setup>
// components and composables
import ReturnBtn from '../components/ReturnBtn.vue';
import { useBack } from '../composables/useBack';

// getting the back function
const {back} = useBack();
</script>

<template>
    <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="absolute bottom-0 right-0 w-64 max-xl:hidden z-[-1]">
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
    <ReturnBtn @click="back"></ReturnBtn>
    <h1 class="text-brand text-4xl justify-self-center xl:text-5xl 2xl:text-6xl">FAQ</h1>
    <p class="text-lg text-brand mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 xl:text-xl 2xl:text-2xl">Q: How do I know that the provided data is accurate?<br>
A: That’s the neat part. You don’t! Just kidding! :) I get this data from the World Bank database, so it is as accurate as they are. Also, keep in mind that it takes some time to calculate and update the data, so for the first couple of months of any given year, the data is probably from the year before previous. This is not something I can impact.
<br><br>
Q: Why did you put a quiz about X, but not Y?<br>
A: Currently, this website is a simple project maintained by one person, so the amount of content is limited accordingly. This may or may not change in the future.
<br><br>
Q: Can I use your questions in my pub quiz/other?<br>
A: Of course!
<br><br>
Q: How did you come up with an idea to create this?<br>
A: I like quizzes and economic data, and I didn’t find anything like this online, so I made it myself.
<br><br>
Q: Why are my results not saved?<br>
A: Your results only save themselves when you solve a quiz while logged in. You were probably logged out.</p>
</template>