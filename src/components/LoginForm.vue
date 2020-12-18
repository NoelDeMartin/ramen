<template>
    <div class="w-full max-w-md space-y-8">
        <div>
            <a href="https://solidproject.org" target="_blank">
                <AppIcon name="solid-emblem" class="mx-auto w-28 h-28" />
            </a>
            <h2 class="text-3xl text-center text-gray-900">
                Log in with Solid
            </h2>
        </div>
        <form class="mt-8 space-y-3" @submit.prevent="submit">
            <div class="-space-y-px rounded-md shadow-sm">
                <div>
                    <label class="sr-only" for="pod-url">Solid POD url</label>
                    <input
                        id="pod-url"
                        ref="input"
                        v-model="identityProvider"
                        class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-solid-500 focus:border-solid-500 focus:z-10 sm:text-sm"
                        required
                        placeholder="Solid POD url"
                    >
                </div>
            </div>
            <button
                class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-solid-600 hover:bg-solid-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solid-500"
                type="submit"
            >
                Log In
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import Auth from '@/services/Auth';

export default defineComponent({
    setup() {
        const identityProvider = ref('https://');
        const input = ref();
        const submit = () => Auth.login(identityProvider.value);

        onMounted(() => (input.value as HTMLInputElement).focus());

        return { identityProvider, input, submit };
    },
});
</script>
