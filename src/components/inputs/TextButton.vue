<template>
    <AGHeadlessButton
        class="flex items-center justify-center gap-1 rounded-md px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        :class="variantClasses"
        :disabled="disabled"
    >
        <slot />
    </AGHeadlessButton>
</template>

<script setup lang="ts">
import { booleanProp, enumProp, removeInteractiveClasses } from '@aerogel/core';
import { computed } from 'vue';

import { Colors } from '@/lib/colors';

const props = defineProps({
    color: enumProp(Colors, Colors.Primary),
    disabled: booleanProp(),
});

const colorClasses = computed(() => {
    switch (props.color) {
        case Colors.Clear:
            return 'text-gray-700 hover:bg-gray-200 focus-visible:outline-gray-400';
        case Colors.Danger:
            return 'bg-red-600 font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-red-600';
        case Colors.Secondary:
            return `
                text-emerald-500 ring-1 ring-inset ring-emerald-500 shadow-sm
                hover:bg-gray-200
                focus-visible:outline-emerald-500
            `;
        case Colors.Solid:
            return 'bg-solid-600 font-semibold text-white shadow-sm hover:bg-solid-500 focus-visible:outline-solid-600';
        case Colors.SolidSecondary:
            return `
                text-solid-500 ring-1 ring-inset ring-solid-500 shadow-sm
                hover:bg-gray-200
                focus-visible:outline-solid-500
            `;
        case Colors.Primary:
        default:
            return `
                bg-emerald-600 font-semibold text-white shadow-sm
                hover:bg-emerald-500
                focus-visible:outline-emerald-600
            `;
    }
});

const variantClasses = computed(() => {
    if (props.disabled) {
        return `opacity-50 ${removeInteractiveClasses(colorClasses.value)}`;
    }

    return colorClasses.value;
});
</script>
