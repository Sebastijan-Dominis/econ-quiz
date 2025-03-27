<script setup>
// imports
import ReturnBtn from '../components/ReturnBtn.vue';
</script>

<template>
    <img src="../assets/images/faq.png" alt="thinking man on a laptop" class="fixed bottom-0 right-0 w-64 max-2xl:hidden z-[-1]">
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
    <ReturnBtn></ReturnBtn>
    <h1 class="text-brand text-4xl justify-self-center xl:text-5xl 2xl:text-6xl">FAQ</h1>
    <p class="text-lg text-brand mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 xl:text-xl 2xl:text-2xl">Q: How do I know that the provided data is accurate?<br>
A: That’s the neat part. You don’t! Just kidding! :) I get this data from the World Bank database, so it is as accurate as they are. Also, keep in mind that it takes them some time to calculate and update the data, so for the first couple of months of any given year, the data is probably from the year before previous. This is not something I can impact.
<br><br>
Q: Why did you put a quiz about X, but not Y?<br>
A: The most popular/relevant topics from the World Bank database are included already (e.g. GDP Nominal, Total Population and Fertility Rate). There is no consistent reliable data available for the GINI coefficient so it is not included. Some of the less relevant topics are also not included but may be in the future. I am mostly restricted by the fact that World Bank fully relies on only the most reliable official data which is not available every year for all of the topics. The good part is that it is as accurate as the governments that provide it.
<br><br>
Q: How are the quizzes created?<br>
A: The quizzes are created using an algorithm that adjusts the difficulty according to which one of the seven difficulties you choose. Apologies if some difficulties seem too easy or too hard relative to the other ones. This is a one man project and it is kinda hard to create perfectly balanced quizzes. They should be balanced enough though.
<br><br>
Q: Why is my leadership score different from my score?<br>
A: Your score represents what % of the questions you got right in that particular quiz. In the case of manual input quizzes it shows how close you were to the right numbers. Leadership score takes that score and "rewards" you with more points for harder quizzes. The exact calculation for this can be found in the leadership section by clicking on the question mark in the top right corner.
<br><br>
Q: How did you come up with an idea to create this?<br>
A: I like quizzes and economic data and I didn’t find anything like this online so I made it myself. Also, this website was a university project for one of my courses.
<br><br>
Q: Why are my results not saved?<br>
A: Your results only save themselves when you finish a quiz while logged in. You were probably logged out.
<br><br>
Q: Can I add some topics?<br>
A: Only admins can add, edit and delete topics. This is done to prevent abuse of those options.
<br><br>
Q: Do you really expect me to click a trillion times in that manual input quiz? What a joke...<br>
A: Click on the question mark in the top right corner while playing it. You can add a trillion in one click :)
<br><br>
Q: Why does the website look so bad on mobile?<br>
A: Because it is currently optimized only for laptops and desktop PCs. I may or may not adapt it to work well on mobile devices as well in the future.
<br><br>
Q: Why is there only one song that constantly repeats itself?<br>
A: Good point... I wanted to add some music but only added one song. Eh, might add more in the future if I feel like it. For now, play something on YT or Spotify when you get bored of this track :D
<br><br>
Q: Why can't I turn off those clock noises on timed quizzes?<br>
A: They are there to help you keep the track of time without looking at the number all the time. I may add an option to turn those sounds off but I think they are helpful.
<br><br>
Q: Will this ever get some substantial new features?<br>
A: I am considering adding multiplayer and maybe even advanced analytics of your results but that may take a while.
<br><br>
Q: Why is there no "Contact us"? I have something to say!<br>
A: Because I tried creating a new email and Google didn't let me, lol. I don't want to leave my personal email here. I apologize for any inconvenience that may have caused.
</p>
</template>