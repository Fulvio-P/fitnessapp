<!-- Ringraziamenti:
https://stackoverflow.com/questions/2812770/add-centered-text-to-the-middle-of-a-hr-like-line
-->

<template>
    <div class="hr-with-text">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "hrWithText"
}
</script>

<style scoped>
.hr-with-text {
    display: flex;
    align-items: center;
    text-align: center;
}
.hr-with-text::before, .hr-with-text::after {
    content: '';
    flex: 1;
    border-bottom: 2px solid var(--nord0);
}
.hr-with-text::before {
    margin-right: 1em;
}
.hr-with-text::after {
    margin-left: 1em;
}
</style>