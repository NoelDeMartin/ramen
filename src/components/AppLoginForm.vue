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
        <AGForm :form="form" class="flex flex-col" @submit="$solid.login(form.loginUrl)">
            <AGInput name="loginUrl" :aria-label="$t('login.url')" :placeholder="$t('login.urlPlaceholder')" />
            <AGButton submit class="mt-2">
                {{ $t('login.submit') }}
            </AGButton>
        </AGForm>
        <div v-if="$solid.wasLoggedIn" class="mt-4 flex flex-col">
            <AGMarkdown
                lang-key="login.previous"
                :lang-params="{ url: $solid.previousSession?.loginUrl }"
                class="text-sm text-gray-800"
                inline
            />
            <div class="mt-2 flex w-full justify-center gap-3">
                <AGButton @click="$solid.reconnect(true)">
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
import { requiredStringInput, useForm } from '@aerogel/core';

const form = useForm({ loginUrl: requiredStringInput() });
</script>
