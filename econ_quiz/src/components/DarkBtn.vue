<script>
    export default {
        name: 'DarkBtn'
    }
</script>

<template>
    <button class="w-36 h-14 rounded-full bg-bgbtn border-brand border-2 font-medium text-wg hover:bg-brand hover:text-bg hover:border-bg active:scale-98">
        <slot></slot>
    </button>
</template>