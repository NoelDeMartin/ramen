<template>
    <div class="flex flex-col items-center space-y-8">
        <div class="flex flex-col items-center space-y-4">
            <AppIcon name="cook" class="w-20 h-20" />
            <span class="items-center text-3xl font-light">You don't have a place to store your recipes</span>
        </div>
        <button
            type="button"
            class="relative flex justify-center px-4 py-2 text-sm text-white bg-green-600 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            @click="createCookbook"
        >
            Create Cookbook
        </button>
    </div>
</template>

<script lang="ts" setup>
import Cookbook from '@/services/Cookbook';

const createCookbook = () => Cookbook.create();
</script>
