<script>
    import ReturnBtn from '../components/ReturnBtn.vue';

    export default {
        name: 'Study',
        components: {
            ReturnBtn
        }
    }
</script>

<template>
    <ReturnBtn @click="this.$router.back()"></ReturnBtn>
</template>