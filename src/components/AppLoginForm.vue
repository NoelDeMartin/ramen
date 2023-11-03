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
        <AGForm :form="form" class="flex flex-col" @submit="$ui.loading($solid.login(form.loginUrl, { onError }))">
            <AGInput name="loginUrl" :aria-label="$t('login.url')" :placeholder="$t('login.urlPlaceholder')" />
            <AGButton submit class="mt-2">
                {{ $t('login.submit') }}
            </AGButton>
        </AGForm>
        <div v-if="$solid.wasLoggedIn && !$solid.loginOngoing" class="mt-4 flex flex-col">
            <AGMarkdown
                lang-key="login.previous"
                :lang-params="{ url: $solid.previousSession?.loginUrl }"
                class="text-sm text-gray-800"
                inline
            />
            <div class="mt-2 flex w-full justify-center gap-3">
                <AGButton @click="$ui.loading($solid.reconnect({ onError, force: true }))">
                    {{ $t('login.reconnect') }}
                </AGButton>
                <AGButton @click="$solid.logout(true)">
                    {{ $t('login.logout') }}
                </AGButton>
            </div>
        </div>
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
