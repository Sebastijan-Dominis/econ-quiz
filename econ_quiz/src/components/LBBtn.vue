<script>
export default {
    name: 'LBBtn',
    props: {
    customClass: {
        type: String,
        required: false,
    },
    },
    methods: {
        handleClick() {
            this.$emit('toggle');
        },
    },
};
</script>

<template>
  <button
    :class="['w-80 h-32 rounded-3xl font-5xl border border-2 font-bold max-xl:w-64 max-xl:h-28 max-lg:w-48 max-lg:h-20 max-md:w-36 max-md:h-12', customClass]" 
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

