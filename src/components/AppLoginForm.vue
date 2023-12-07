<template>
    <div class="flex w-full max-w-md flex-col space-y-6">
        <div class="flex flex-col items-center">
            <a href="https://solidproject.org" target="_blank">
                <i-app-solid-emblem class="mx-auto h-28 w-28" />
            </a>
            <h2 class="text-center text-3xl text-gray-900">
                {{ $t('login.title') }}
            </h2>
        </div>
        <template v-if="$solid.wasLoggedIn() && !$solid.loginOngoing">
            <div class="flex flex-col space-y-6 rounded border border-gray-300 bg-gray-100 p-4">
                <AGMarkdown
                    lang-key="login.previous"
                    :lang-params="{ url: $solid.user.webId, name: $solid.user.name ?? $solid.user.webId }"
                    class="text-sm opacity-90"
                />
                <div class="flex flex-row-reverse justify-start">
                    <FormButton color="secondary" @click="$ui.loading($solid.reconnect({ onError, force: true }))">
                        {{ $t('login.reconnect') }}
                    </FormButton>
                    <FormButton class="mr-3" color="clear" @click="$solid.logout(true)">
                        {{ $t('login.logout') }}
                    </FormButton>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <div class="h-px flex-grow bg-gray-300" />
                <span>{{ $t('login.previousSeparator') }}</span>
                <div class="h-px flex-grow bg-gray-300" />
            </div>
        </template>
        <AGForm :form="form" class="flex flex-col" @submit="$ui.loading($solid.login(form.loginUrl, { onError }))">
            <FormInput name="loginUrl" :aria-label="$t('login.url')" :placeholder="$t('login.urlPlaceholder')" />
            <FormButton color="solid" submit class="mt-2">
                {{ $t('login.submit') }}
            </FormButton>
        </AGForm>
    </div>
</template>

<script setup lang="ts">
import { UI, requiredStringInput, useForm } from '@aerogel/core';

import LoginErrorModal from '@/components/modals/LoginErrorModal.vue';
import type { ErrorSource } from '@aerogel/core';

const form = useForm({ loginUrl: requiredStringInput('https://') });

function onError(error: ErrorSource): void {
    form.reset({ keepData: true });
    UI.openModal(LoginErrorModal, { error });
}
</script>
