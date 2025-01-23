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
        <span class="mx-4 block text-center whitespace-pre-line">{{ label }}</span>
    </DarkBtn>
</template>