<template>
    <div v-if="errorMessage" class="flex flex-col items-center gap-4 p-8">
        <i-twemoji-face-screaming-in-fear class="size-20" />
        <Markdown
            as="h1"
            inline
            class="overflow-hidden text-center text-3xl overflow-ellipsis text-red-600"
            :text="errorMessage"
        />
        <div class="flex flex-col gap-3">
            <Button variant="danger" @click="$ui.loading($solid.reconnect({ force: true }))">
                {{ $t('login.errorReconnect') }}
            </Button>
            <Button variant="danger" @click="$ui.loading($solid.logout(true).then(() => $app.reload()))">
                {{ $t('login.errorLogout') }}
            </Button>
            <Button variant="danger" @click="$errors.inspect($solid.error)">
                {{ $t('login.errorInspect') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Solid } from '@aerogel/plugin-solid';
import { getErrorMessage, translate } from '@aerogel/core';

const errorMessage = computed(() => {
    if (!Solid.error) {
        return;
    }

    const message = getErrorMessage(Solid.error);

    return translate('login.errorInfo', { message });
});
</script>
