<template>
    <component :is="iconComponent" class="fill-current" />
</template>

<script lang="ts">
import { Component, defineComponent } from 'vue';

export default defineComponent({
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    computed: {
        iconComponent(): Component {
            return require(`@/assets/icons/${this.name}.svg`).default;
        },
    },
});
</script>
