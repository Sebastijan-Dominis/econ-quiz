<script>
    import Choice from '../components/Choice.vue';
    import PageTop from '../components/PageTop.vue';

    export default {
        name: 'StudyChoice',
        components: {
            PageTop,
            Choice,
        }
    }
</script>

<template>
    <PageTop>Choose a Topic to Study</PageTop>
    <Choice></Choice>
</template>