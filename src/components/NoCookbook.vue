<template>
    <div class="flex flex-col items-center space-y-8">
        <div class="flex flex-col items-center space-y-4">
            <AppIcon name="cook" class="w-20 h-20" />
            <span class="items-center text-3xl font-light text-center">You don't have a place to store your recipes</span>
        </div>
        <div class="flex flex-col items-center space-y-4 md:space-y-0 md:space-x-2 md:flex-row">
            <button
                type="button"
                class="relative flex justify-center px-4 py-2 text-sm text-white bg-green-600 border border-transparent rounded-md group hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                @click="createCookbook"
            >
                Create Cookbook
            </button>
            <span class="text-sm text-center">
                at
                <AppSelect
                    :options="storageUrlsOptions"
                    :model-value="storageUrl"
                    @update:model-value="changeStorage"
                />
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import Cookbook from '@/services/Cookbook';
import Auth from '@/services/Auth';

import AppSelect, { AppSelectOption } from '@/components/AppSelect.vue';

export default defineComponent({
    components: {
        AppSelect,
    },
    setup() {
        const storageUrl = ref<string>('');
        const storageUrls = ref<string[]>([]);
        const storageUrlsOptions = computed<AppSelectOption[]>(
            () => storageUrls.value
                .map(url => ({ text: url, value: url }))
                .concat({ text: 'Use another url', value: 'add' }),
        );
        const changeStorage = (storage: string) => {
            if (storage === 'add') {
                const newStorage = prompt('Where do you want to store your cookbook?');

                if (!newStorage)
                    return;

                storage = newStorage;
                storageUrls.value.push(newStorage);
            }

            storageUrl.value = storage;
        };
        const createCookbook = async () => {
            try {
                await Cookbook.create(storageUrl.value);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        };

        Auth.profile.then(profile => {
            if (!profile)
                return;

            storageUrls.value = profile.storageUrls;
            storageUrl.value = profile.storageUrls[0];
        });

        return { storageUrl, storageUrlsOptions, changeStorage, createCookbook };
    },
});
</script>
