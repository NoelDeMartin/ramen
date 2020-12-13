<template>
    <div class="flex flex-col items-center space-y-8">
        <span class="text-3xl font-light text-center">You know how to make Ramen!</span>
        <a :href="ramen.url" target="_blank">
            <AppIcon name="ramen" class="w-40 h-40" />
        </a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Recipe from '@/models/soukai/Recipe';

export default defineComponent({
    props: {
        ramen: {
            type: Object as () => Recipe,
            required: true,
        },
    },
});
</script>
