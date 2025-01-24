<script>
    import PageTop from '../components/PageTop.vue';
    import ReturnBtn from '../components/ReturnBtn.vue';
    export default {
        name: 'Results',
        components: {
            PageTop,
            ReturnBtn,
        },
        data() {
            return {
                titles: ['Quiz Name', 'Difficulty', 'Result'],
            }
        }
    }
</script>

<template>
    
<!-- Desktop -->
<div class="max-lg:hidden">
    <PageTop>Results</PageTop>
    <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Results: Category Name</h2>
</div>

<div class="grid grid-cols-3 mx-32 gap-12 max-lg:hidden">
    <div v-for="(title, index) in titles" :key="index" class="flex flex-col items-center mt-12">
      <h2 class="text-3xl text-brand font-bold text-center">{{ title }}</h2>
  </div>
</div>

<!-- Mobile -->
 <div class="lg:hidden">
     <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 z-[-1]"></div>
     <h1 class="text-brand text-6xl justify-self-center max-lg:text-5xl max-md:text-4xl max-md:w-64 text-center">Results</h1>
     <ReturnBtn @click="this.$router.back()" class="fixed bottom-12 left-4"></ReturnBtn>
     <h2 class="text-brand text-3xl lg:text-4xl xl:text-5xl justify-self-center mx-8 my-16 md:mx-16 lg:mx-28 xl:mx-40 2xl:mx-64 text-center">Results: Category Name</h2>
 </div>

<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
<div class="w-72 h-52 bg-bgbtn border border-brand border-2 rounded-3xl justify-self-center place-items-center my-12 lg:hidden grid">
    <div class="grid grid-cols-2 gap-x-16 gap-y-8 text-wg font-bold">
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
        <h2>adsfasfd</h2>
    </div> 
</div>
</template>