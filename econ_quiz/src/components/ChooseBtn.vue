<script>
    import DarkBtn from './DarkBtn.vue';
    export default {
        name: 'ChooseBtn',
        components: {
            DarkBtn,
        },
        props: {
            label: String,
        }
    }
</script>

<template>
    <DarkBtn class="w-56 h-14">
        {{ label }}
    </DarkBtn>
</template>