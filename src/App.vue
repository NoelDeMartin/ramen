<template>
    <div class="flex flex-col items-center w-screen h-screen overflow-auto text-base antialiased font-normal leading-tight text-gray-900 bg-yellow-50 font-ubuntu">
        <AppHeader v-if="isLoggedIn" />

        <div class="flex items-center self-stretch justify-center flex-grow p-10">
            <h1 v-if="isLoading" class="text-5xl text-center">
                Loading...
            </h1>

            <template v-else>
                <h1 v-if="errorMessage" class="overflow-hidden text-3xl text-center text-red-600 overflow-ellipsis">
                    Error: {{ errorMessage }}
                </h1>

                <template v-else-if="isLoggedIn">
                    <NoCookbook v-if="!isCookbookAvailable" />
                    <NoRamen v-else-if="!ramen" />
                    <Ramen v-else :ramen="ramen" />
                </template>

                <LoginForm v-else />
            </template>
        </div>

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
import AppHeader from '@/components/AppHeader.vue';
import LoginForm from '@/components/LoginForm.vue';
import NoCookbook from '@/components/NoCookbook.vue';
import NoRamen from '@/components/NoRamen.vue';
import RamenComponent from '@/components/Ramen.vue';

type Data = {
    isLoading: boolean;
    isLoggedIn: boolean;
    isCookbookAvailable: boolean;
    ramen: Recipe | null;
    errorMessage: string | null;
};

export default defineComponent({
    name: 'App',
    components: {
        AppFooter,
        AppHeader,
        LoginForm,
        NoCookbook,
        NoRamen,
        Ramen: RamenComponent,
    },
    data: (): Data => ({
        isLoading: true,
        isLoggedIn: false,
        isCookbookAvailable: false,
        ramen: null,
        errorMessage: null,
    }),
    async created() {
        try {
            await Promise.all([
                Auth.start(),
                Cookbook.start(),
                Ramen.start(),
            ]);

            Cookbook.loaded.then(() => this.isCookbookAvailable = true);
            Ramen.loaded.then(() => this.ramen = Ramen.model);
        } catch (error) {
            console.error(error);

            this.errorMessage = error.message;
        } finally {
            this.isLoggedIn = Auth.isLoggedIn;
            this.isLoading = false;
        }
    },
});
</script>
