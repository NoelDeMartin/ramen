<template>
    <AGHeadlessModal
        ref="$modal"
        v-slot="{ close }"
        v-bind="props"
        class="relative z-50"
    >
        <div class="fixed inset-0 z-10">
            <div class="flex h-full items-center justify-center p-4 text-center">
                <AGHeadlessModalPanel
                    class="relative max-h-full transform overflow-auto rounded-lg bg-white text-left shadow-xl"
                    :class="{ 'p-4': !noPadding }"
                >
                    <AGHeadlessModalTitle v-if="title" class="text-base font-semibold leading-6 text-gray-900">
                        <AGMarkdown :text="title" inline />
                    </AGHeadlessModalTitle>
                    <slot :close="close" />
                </AGHeadlessModalPanel>
            </div>
        </div>
    </AGHeadlessModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { booleanProp, useModalExpose, useModalProps } from '@aerogel/core';
import type { IAGHeadlessModal, IAGModal } from '@aerogel/core';

const props = defineProps({
    noPadding: booleanProp(),
    ...useModalProps(),
});
const $modal = ref<IAGHeadlessModal>();

defineOptions({ inheritAttrs: false });
defineExpose<IAGModal>(useModalExpose($modal));
</script>
