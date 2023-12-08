<template>
    <AGHeadlessSnackbar
        :class="colorClasses"
        class="flex max-w-md rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
        <div class="p-2">
            <span class="p-2">
                <AGMarkdown :text="message" inline />
            </span>

            <TextButton
                v-for="(action, i) of actions"
                :key="i"
                :color="color"
                @click="activate(action)"
            >
                {{ action.text }}
            </TextButton>
        </div>
    </AGHeadlessSnackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Colors, useSnackbar, useSnackbarProps } from '@aerogel/core';

const props = defineProps(useSnackbarProps());
const { activate } = useSnackbar(props);

const colorClasses = computed(() => {
    switch (props.color) {
        case Colors.Danger:
            return 'bg-red-50';
        case Colors.Secondary:
        default:
            return 'bg-white';
    }
});
</script>
