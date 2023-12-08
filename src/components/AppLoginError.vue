<template>
    <div v-if="errorMessage" class="flex flex-col items-center">
        <AGMarkdown
            as="h1"
            inline
            class="overflow-hidden overflow-ellipsis text-center text-3xl text-red-600"
            :text="errorMessage"
        />

        <div class="mt-4 flex gap-3">
            <TextButton @click="$solid.reconnect({ force: true })">
                {{ $t('login.errorReconnect') }}
            </TextButton>
            <TextButton @click="$solid.logout(true)">
                {{ $t('login.errorLogout') }}
            </TextButton>
            <TextButton @click="$errors.inspect($solid.error)">
                {{ $t('login.errorInspect') }}
            </TextButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Solid } from '@aerogel/plugin-solid';
import { Errors, translate } from '@aerogel/core';

const errorMessage = computed(() => {
    if (!Solid.error) {
        return;
    }

    const message = Errors.getErrorMessage(Solid.error);

    return translate('login.errorInfo', { message });
});
</script>
