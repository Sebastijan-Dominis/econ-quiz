<script>
    import Choice from '../components/Choice.vue';
    import PageTop from '../components/PageTop.vue';

    export default {
        name: 'QuizChoice',
        components: {
            PageTop,
            Choice,
        }
    }
</script>

<template>
    <PageTop>Choose a quiz</PageTop>
    <Choice></Choice>
</template>