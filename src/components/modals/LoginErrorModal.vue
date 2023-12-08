<template>
    <ModalWrapper :title="$t('loginError.title')">
        <AGMarkdown lang-key="loginError.description" />
        <div v-if="error" class="mt-2 flex justify-center">
            <TextButton color="danger" @click="$errors.inspect(error)">
                {{ $t('loginError.inspect') }}
            </TextButton>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
import { objectProp } from '@aerogel/core';
import type { ErrorSource } from '@aerogel/core';

defineProps({
    error: objectProp<ErrorSource>(),
});
</script>
