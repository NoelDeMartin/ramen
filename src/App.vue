<template>
    <div class="flex flex-col items-center w-screen h-screen overflow-auto text-base antialiased font-normal leading-tight text-gray-900 bg-yellow-50 font-ubuntu">
        <AppHeader v-if="isLoggedIn" />

        <div class="flex items-center self-stretch justify-center flex-grow p-10">
            <div
                v-if="isLoading"
                :class="{
                    'flex flex-col items-center space-y-6 opacity-0 transition-opacity duration-500': true,
                    'opacity-100': showLoading,
                }"
            >
                <AppIcon name="searching" class="w-20 h-20 text-green-500" />
                <h1 class="text-5xl text-center">
                    Searching Ramen...
                </h1>
            </div>

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
        <AppLoader />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { after } from '@noeldemartin/utils';

import Recipe from '@/models/soukai/Recipe';

import Auth from '@/services/Auth';
import Cookbook from '@/services/Cookbook';
import Ramen from '@/services/Ramen';

import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppLoader from '@/components/AppLoader.vue';
import LoginForm from '@/components/LoginForm.vue';
import NoCookbook from '@/components/NoCookbook.vue';
import NoRamen from '@/components/NoRamen.vue';
import RamenComponent from '@/components/Ramen.vue';

type Data = {
    showLoading: boolean,
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
        AppLoader,
        LoginForm,
        NoCookbook,
        NoRamen,
        Ramen: RamenComponent,
    },
    data: (): Data => ({
        showLoading: false,
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
            this.showLoading = false;
        }
    },
    async mounted() {
        await after({ milliseconds: 500 });

        this.showLoading = this.isLoading;
    },
});
</script>
