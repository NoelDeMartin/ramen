<template>
    <ModalWrapper :cancellable="false">
        <div class="flex items-center justify-center gap-2">
            <i-svg-spinners:90-ring-with-bg class="h-8 w-8 flex-shrink-0 text-emerald-600" />
            <AGMarkdown :text="renderedMessage" class="text-gray-500" />
        </div>
    </ModalWrapper>
</template>

<script setup lang="ts">
import { useLoadingModal, useLoadingModalProps } from '@aerogel/core';

const props = defineProps(useLoadingModalProps());
const { renderedMessage } = useLoadingModal(props);
</script>
