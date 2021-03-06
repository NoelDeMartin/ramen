<template>
    <div class="flex self-stretch justify-between p-4">
        <div v-if="profile" class="flex flex-col space-y-2">
            <div class="flex items-center text-sm" :title="`Your Web Id is ${profile.webId}`">
                <AppIcon name="user" class="w-4 h-4 mr-2" />
                <a
                    class="text-gray-700 hover:text-gray-900 hover:underline"
                    :href="profile.webId"
                    target="_blank"
                >
                    {{ profile.name ?? profile.webId }}
                </a>
            </div>
            <div
                v-if="cookbook"
                class="flex items-center text-sm"
                :title="`Your recipes container is ${cookbook.url}`"
            >
                <AppIcon name="book" class="w-4 h-4 mr-2" />
                <a
                    class="text-gray-700 hover:text-gray-900 hover:underline"
                    :href="cookbook.url"
                    target="_blank"
                >
                    {{ cookbook.name }}
                </a>
            </div>
        </div>
        <div v-else />
        <button
            type="button"
            class="text-red-500 hover:text-red-800"
            title="Logout"
            @click="logout"
        >
            <AppIcon name="logout" class="w-8 h-8" />
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { safe } from '@/utils';

import CookbookModel from '@/models/soukai/Cookbook';

import Auth, { UserProfile } from '@/services/Auth';
import Cookbook from '@/services/Cookbook';

export default defineComponent({
    setup() {
        const profile = ref<UserProfile | null>(null);
        const cookbook = ref<CookbookModel | null>(null);
        const showInfo = ref<boolean>(false);

        Auth.profile.then(_profile => profile.value = _profile);
        Cookbook.loaded.then(_cookbook => cookbook.value = _cookbook);

        return {
            profile,
            cookbook,
            showInfo,
            logout: safe('Logging out...', () => Auth.logout()),
        };
    },
});
</script>
