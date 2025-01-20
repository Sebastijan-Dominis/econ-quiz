<script>
export default {
    name: 'LBBtn',
    props: {
    class: {
        type: String,
        required: false,
    },
    },
    methods: {
        handleClick() {
            this.$emit('click');
        },
    },
};
</script>

<template>
  <button
    :class="['w-80 h-32 rounded-3xl font-5xl border border-2 font-bold', class]" 
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

