<script>
  export default {
    name: 'App'
  }
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Background Image -->
    <img src="../src/assets/images/background.jpg" class="fixed top-0 left-0 w-full h-full object-cover z-[-3]" alt="background image showing a map of the world with some pins and money"/>
    <!-- Semi-Transparent Overlay -->
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[-2]"></div>
    <router-view></router-view>
  </div>
</template>