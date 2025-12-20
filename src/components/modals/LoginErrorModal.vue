<template>
    <Modal :title="$t('loginError.title')">
        <Markdown lang-key="loginError.description" />
        <div v-if="error" class="mt-2 flex justify-center">
            <Button variant="danger" @click="$errors.inspect(error)">
                {{ $t('loginError.inspect') }}
            </Button>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import type { ErrorSource } from '@aerogel/core';

defineProps<{ error: ErrorSource }>();
</script>
