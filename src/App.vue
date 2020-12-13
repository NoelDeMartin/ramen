<template>
    <div class="flex flex-col items-center justify-center w-screen h-screen p-10 text-base antialiased font-normal leading-tight text-gray-900 font-ubuntu bg-yellow-50">
        <span v-if="isLoading" class="text-5xl">Loading...</span>

        <template v-else>
            <LoginForm v-if="!isLoggedIn" />

            <template v-else>
                <NoCookbook v-if="!isCookbookAvailable" />
                <NoRamen v-else-if="!ramen" />
                <Ramen v-else :ramen="ramen" />

                <LogoutButton v-if="isLoggedIn" />
            </template>
        </template>

        <AppFooter />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Recipe from '@/models/soukai/Recipe';

import Auth from '@/services/Auth';
import Cookbook from '@/services/Cookbook';
import Ramen from '@/services/Ramen';

import AppFooter from '@/components/AppFooter.vue';
import LoginForm from '@/components/LoginForm.vue';
import LogoutButton from '@/components/LogoutButton.vue';
import NoCookbook from '@/components/NoCookbook.vue';
import NoRamen from '@/components/NoRamen.vue';
import RamenComponent from '@/components/Ramen.vue';

type Data = {
    isLoading: boolean;
    isLoggedIn: boolean;
    isCookbookAvailable: boolean;
    ramen: Recipe | null;
};

export default defineComponent({
    name: 'App',
    components: {
        AppFooter,
        LoginForm,
        LogoutButton,
        NoCookbook,
        NoRamen,
        Ramen: RamenComponent,
    },
    data: (): Data => ({
        isLoading: true,
        isLoggedIn: false,
        isCookbookAvailable: false,
        ramen: null,
    }),
    async created() {
        await Promise.all([
            Auth.start(),
            Cookbook.start(),
            Ramen.start(),
        ]);

        Cookbook.loaded.then(() => this.isCookbookAvailable = true);
        Ramen.loaded.then(() => this.ramen = Ramen.model);
        this.isLoggedIn = Auth.isLoggedIn;
        this.isLoading = false;
    },
});
</script>
