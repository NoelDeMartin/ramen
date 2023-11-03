<template>
    <AGModal>
        <AGModalTitle>
            {{ $t('loginError.title') }}
        </AGModalTitle>
        <AGMarkdown lang-key="loginError.description" />
        <AGButton v-if="error" class="mt-2" @click="$errors.inspect(error)">
            {{ $t('loginError.inspect') }}
        </AGButton>
    </AGModal>
</template>

<script setup lang="ts">
import { objectProp } from '@aerogel/core';
import type { ErrorSource } from '@aerogel/core';

defineProps({
    error: objectProp<ErrorSource>(),
});
</script>
