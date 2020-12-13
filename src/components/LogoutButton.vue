<template>
    <button
        type="button"
        class="fixed text-red-500 top-6 right-6 hover:text-red-800"
        title="Logout"
        @click="logout"
    >
        <AppIcon name="logout" class="w-8 h-8" />
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Auth from '@/services/Auth';

export default defineComponent({
    methods: {
        logout() {
            Auth.logout();
        },
    },
});
</script>
