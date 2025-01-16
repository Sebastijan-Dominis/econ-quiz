<script>
</script>

<template>
  <div class="background-container">
    <img src="../src/assets/images/background.jpg" class="background-image" />
    <div class="cover"></div>
  </div>
</template>

<style scoped>
.background-container {
  position: relative;
  min-height: 100vh; 
  padding: 20px; 
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2; 
}

.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); 
  z-index: -1; 
}
</style>
