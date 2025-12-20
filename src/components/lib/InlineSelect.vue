<template>
    <HeadlessSelect
        v-bind="props"
        ref="$selectRef"
        as="div"
        class="relative inline"
    >
        <HeadlessSelectTrigger class="inline-flex items-center">
            <HeadlessSelectValue />
            <i-zondicons-cheveron-down class="size-4" />
        </HeadlessSelectTrigger>

        <SelectOptions />
    </HeadlessSelect>
</template>

<script setup lang="ts">
import type { SelectProps } from '@aerogel/core';

const props = defineProps<SelectProps>();
</script>
