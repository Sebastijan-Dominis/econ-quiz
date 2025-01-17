<script>
    import ReturnBtn from '../components/ReturnBtn.vue';

    export default {
        name: 'FAQ',
        components: {
            ReturnBtn
        }
    }
</script>

<template>
    <ReturnBtn @click="this.$router.back()"></ReturnBtn>
</template>