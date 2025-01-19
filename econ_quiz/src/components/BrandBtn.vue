<script>
    export default {
        name: 'brandbtn'
    }
</script>

<template>
    <button class="w-36 h-14 rounded-full bg-brand border-bg border-2 font-medium text-bg hover:bg-bgbtn hover:border-brand hover:text-wg active:scale-98">
        <slot></slot>
    </button>
</template>