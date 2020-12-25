<template>
    <div
        :class="{
            'fixed inset-0 flex items-center justify-center transition-opacity duration-300': true,
            'opacity-0 pointer-events-none': !open,
        }"
    >
        <div class="absolute inset-0 bg-black opacity-50" />
        <div
            :class="{
                'z-10 p-5 bg-white rounded shadow transform scale-50 transition-transform duration-500': true,
                'scale-100': open,
            }"
        >
            <span class="flex space-x-4">
                <AppIcon name="loader" class="w-8 h-8 text-green-700" />
                <span class="text-2xl font-light">{{ message }}</span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

const open = ref<boolean>(false);
const message = ref<string>('');

export function showLoading(_message: string): void {
    message.value = _message;
    open.value = true;
}

export function hideLoading(): void {
    open.value = false;
}

export default defineComponent({
    setup: () => ({ open, message }),
});
</script>
