<template>
    <div v-if="errorMessage" class="flex flex-col items-center gap-4 p-8">
        <i-twemoji-face-screaming-in-fear class="h-20 w-20" />
        <AGMarkdown
            as="h1"
            inline
            class="overflow-hidden overflow-ellipsis text-center text-3xl text-red-600"
            :text="errorMessage"
        />
        <div class="flex flex-col gap-3">
            <TextButton color="danger" @click="$ui.loading($solid.reconnect({ force: true }))">
                {{ $t('login.errorReconnect') }}
            </TextButton>
            <TextButton color="danger" @click="$ui.loading($solid.logout(true).then(() => $app.reload()))">
                {{ $t('login.errorLogout') }}
            </TextButton>
            <TextButton color="danger" @click="$errors.inspect($solid.error)">
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
