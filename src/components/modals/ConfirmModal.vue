<template>
    <ModalWrapper v-slot="{ close }" :title="title" :cancellable="false">
        <AGMarkdown :text="message" class="text-sm text-gray-500" />
        <div class="mt-4 flex flex-row-reverse">
            <TextButton @click="close(true)">
                {{ renderedAcceptText }}
            </TextButton>
            <TextButton color="clear" class="mr-2" @click="close(false)">
                {{ renderedCancelText }}
            </TextButton>
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
import { useConfirmModal, useConfirmModalProps } from '@aerogel/core';

const props = defineProps(useConfirmModalProps());
const { renderedAcceptText, renderedCancelText } = useConfirmModal(props);
</script>
