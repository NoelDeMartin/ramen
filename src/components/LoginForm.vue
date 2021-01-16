<template>
    <div class="w-full max-w-md space-y-6">
        <div class="flex flex-col items-center">
            <a href="https://solidproject.org" target="_blank">
                <AppIcon name="solid-emblem" class="mx-auto w-28 h-28" />
            </a>
            <h2 class="text-3xl text-center text-gray-900">
                Log in with Solid
            </h2>
        </div>
        <template v-if="wasLoggedIn">
            <div class="flex flex-col p-4 space-y-6 bg-gray-100 border border-gray-300 rounded">
                <span class="text-sm text-gray-800">
                    You were logged in with <a
                        :href="previousLoginUrl"
                        target="_blank"
                        class="font-medium text-gray-700 hover:underline hover:text-gray-900"
                    >{{ previousLoginUrl }}</a>
                </span>
                <div class="flex justify-end space-x-3">
                    <button
                        type="button"
                        class="text-sm text-gray-600 hover:underline hover:text-gray-700"
                        @click="logout()"
                    >
                        Forget it
                    </button>
                    <button
                        type="button"
                        class="px-4 py-2 text-sm border rounded border-solid-600 hover:bg-gray-200 hover:border-solid-700 text-solid-600 hover:text-solid-700"
                        @click="logInUsingPreviousLoginData"
                    >
                        Log in again
                    </button>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="flex-grow h-px bg-gray-300" />
                <span>or</span>
                <div class="flex-grow h-px bg-gray-300" />
            </div>
        </template>
        <form class="flex flex-col items-center space-y-3" @submit.prevent="submit">
            <div class="self-stretch -space-y-px rounded-md shadow-sm">
                <div>
                    <label class="sr-only" for="login-url">Solid login url</label>
                    <input
                        id="login-url"
                        ref="loginUrlInput"
                        v-model="loginUrl"
                        class="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-solid-500 focus:border-solid-500 focus:z-10 sm:text-sm"
                        placeholder="Introduce your webId or identity provider"
                    >
                </div>
            </div>
            <div v-if="authenticationMethod" class="self-stretch space-y-1">
                <label class="sr-only" for="authentication-method">Authentication method</label>
                <select
                    id="authentication-method"
                    ref="authenticationMethodSelect"
                    v-model="authenticationMethod"
                    class="w-full px-3 py-2 mt-1 truncate bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-solid-500 focus:border-solid-500 sm:text-sm"
                >
                    <option
                        v-for="method of authenticationMethods"
                        :key="method"
                        :value="method"
                    >
                        Log in using {{ authenticationMethodNames[method] }}
                    </option>
                </select>
                <p class="text-sm text-gray-500">
                    {{ authenticationMethodDescription }}
                    <a
                        :href="authenticationMethodUrl"
                        target="_blank"
                        class="text-gray-600 underline hover:text-gray-800"
                    >
                        Learn more
                    </a>
                </p>
                <div class="h-2" />
            </div>
            <button
                class="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-solid-600 hover:bg-solid-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-solid-500"
                type="submit"
            >
                Log in
            </button>
            <button
                v-if="!authenticationMethod"
                class="text-sm text-center text-gray-700 underline hover:text-gray-900"
                @click="showAuthenticationMethods"
            >
                Can't log in? try using a different authentication method
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, Ref, computed } from 'vue';

import { AuthenticationMethod, defaultAuthenticationMethod } from '@/authentication';
import { safe } from '@/utils';

import Auth from '@/services/Auth';

const authenticationMethodNames: Record<AuthenticationMethod, string> = {
    [AuthenticationMethod.DPoP]: 'Inrupt\'s authentication library',
    [AuthenticationMethod.Legacy]: 'the legacy authentication library',
};

const authenticationMethodDescriptions: Record<AuthenticationMethod, string> = {
    [AuthenticationMethod.DPoP]:
        'Inrupt\'s authentication library uses DPoP, and most servers should work using this method.',
    [AuthenticationMethod.Legacy]:
        'This authentication method is no longer recommended, but some old servers may need to use it.',
};

const authenticationMethodUrls: Record<AuthenticationMethod, string> = {
    [AuthenticationMethod.DPoP]: 'https://github.com/inrupt/solid-client-authn-js',
    [AuthenticationMethod.Legacy]: 'https://github.com/solid/solid-auth-client',
};

export default defineComponent({
    setup() {
        const loginUrl = ref('https://');
        const authenticationMethod = ref<AuthenticationMethod>();
        const authenticationMethodDescription = computed(
            () => authenticationMethod.value && authenticationMethodDescriptions[authenticationMethod.value],
        );
        const authenticationMethodUrl = computed(
            () => authenticationMethod.value && authenticationMethodUrls[authenticationMethod.value],
        );
        const authenticationMethods = Object.values(AuthenticationMethod);
        const wasLoggedIn = Auth.wasLoggedIn;
        const previousLoginUrl = Auth.previousLogin?.loginUrl;
        const loginUrlInput = ref() as Ref<HTMLInputElement>;
        const authenticationMethodSelect = ref() as Ref<HTMLSelectElement>;

        onMounted(() => loginUrlInput.value.focus());

        return {
            loginUrl,
            authenticationMethod,
            authenticationMethodNames,
            authenticationMethodDescription,
            authenticationMethodUrl,
            authenticationMethods,
            wasLoggedIn,
            previousLoginUrl,
            loginUrlInput,
            authenticationMethodSelect,
            showAuthenticationMethods: () => {
                authenticationMethod.value = defaultAuthenticationMethod;

                nextTick(() => authenticationMethodSelect.value.focus());
            },
            logout: safe('Logging out...', () => Auth.logout()),
            submit: safe(
                'Logging in...',
                () => loginUrl.value && Auth.login(loginUrl.value, authenticationMethod.value),
            ),
            logInUsingPreviousLoginData: safe(
                'Logging in...',
                async () => {
                    if (!Auth.previousLogin)
                        return;

                    await Auth.login(Auth.previousLogin.loginUrl, Auth.previousLogin.authenticationMethod);
                },
            ),
        };
    },
});
</script>
