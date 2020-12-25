<template>
    <div class="flex flex-col items-center space-y-8">
        <div class="flex flex-col items-center space-y-4">
            <AppIcon name="crying" class="w-20 h-20" />
            <span class="items-center text-3xl font-light">You don't know how to make Ramen</span>
        </div>
        <button
            type="button"
            class="relative flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            @click="learnToMakeRamen"
        >
            Teach me
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { safe } from '@/utils';

import Ramen from '@/services/Ramen';

export default defineComponent({
    setup: () => ({
        learnToMakeRamen: safe('Preparing recipe...', () => Ramen.learnRecipe()),
    }),
});
</script>
