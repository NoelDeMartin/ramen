<template>
    <div v-if="errorMessage" class="flex flex-col items-center">
        <AGMarkdown
            as="h1"
            inline
            class="overflow-hidden overflow-ellipsis text-center text-3xl text-red-600"
            :text="errorMessage"
        />

        <div class="mt-4 flex gap-3">
            <AGButton @click="$solid.reconnect(true)">
                {{ $t('login.errorReconnect') }}
            </AGButton>
            <AGButton @click="$solid.logout(true)">
                {{ $t('login.errorLogout') }}
            </AGButton>
            <AGButton @click="$errors.inspect($solid.error)">
                {{ $t('login.errorInspect') }}
            </AGButton>
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
