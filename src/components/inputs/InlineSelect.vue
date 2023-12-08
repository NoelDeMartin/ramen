<template>
    <AGHeadlessSelect
        v-bind="props"
        ref="$select"
        as="div"
        class="relative inline"
    >
        <AGHeadlessSelectButton class="inline-flex items-center">
            <template #icon>
                <i-zondicons-cheveron-down class="h-4 w-4" />
            </template>
        </AGHeadlessSelectButton>

        <div class="absolute mt-1 rounded-md bg-white shadow-lg">
            <AGHeadlessSelectOptions
                class="shadow-xs max-h-60 overflow-auto rounded-md text-base leading-6 focus:outline-none sm:text-sm sm:leading-5"
            >
                <AGHeadlessSelectOption
                    v-for="(option, index) in $select?.options"
                    v-slot="{ active, selected }: IAGHeadlessSelectOptionSlotProps"
                    :key="index"
                    :value="option.value"
                    as="template"
                >
                    <li
                        class="relative cursor-pointer select-none truncate py-2 pl-3 pr-9 text-left focus:outline-none"
                        :class="{
                            'bg-emerald-600 text-white': active,
                            'text-gray-900': !active,
                            'font-medium': selected,
                        }"
                    >
                        {{ option.text }}
                    </li>
                </AGHeadlessSelectOption>
            </AGHeadlessSelectOptions>
        </div>
    </AGHeadlessSelect>
</template>

<script setup lang="ts">
import { componentRef, useSelectProps } from '@aerogel/core';
import type { IAGHeadlessSelect, IAGHeadlessSelectOptionSlotProps } from '@aerogel/core';

const props = defineProps(useSelectProps());
const $select = componentRef<IAGHeadlessSelect>();
</script>
