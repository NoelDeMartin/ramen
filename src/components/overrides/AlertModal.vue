<template>
    <ModalWrapper :title="title">
        <AGMarkdown :text="message" class="text-sm text-gray-500" />
    </ModalWrapper>
</template>

<script setup lang="ts">
import { useAlertModalProps } from '@aerogel/core';

defineProps(useAlertModalProps());
</script>
