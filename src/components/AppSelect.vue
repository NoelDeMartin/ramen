<template>
    <div class="relative inline">
        <Listbox :model-value="modelValue" @update:model-value="updateSelectedOption">
            <ListboxButton class="inline-flex items-center">
                <span class="mb-px">{{ selectedOption?.text ?? '' }}</span>
                <AppIcon name="chevron-down" class="w-4 h-4" />
            </ListboxButton>

            <div class="absolute mt-1 bg-white rounded-md shadow-lg">
                <ListboxOptions
                    class="overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
                >
                    <ListboxOption
                        v-for="option of options"
                        :key="option.value"
                        :value="option.value"
                        :class-name="resolveListboxOptionClassName"
                    >
                        {{ option.text }}
                    </ListboxOption>
                </ListboxOptions>
            </div>
        </Listbox>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { arrayFilter, arrayFirst } from '@noeldemartin/utils';

export interface AppSelectOption {
    text: string;
    value: string;
}

export default defineComponent({
    components: {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
    },
    props: {
        modelValue: {
            type: String,
            required: true,
        },
        options: {
            type: Array as () => AppSelectOption[],
            required: true,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        selectedOption(): AppSelectOption | null {
            return arrayFirst(this.options, option => option.value === this.modelValue) ?? null;
        },
    },
    methods: {
        resolveListboxOptionClassName({ active, selected }: { active: boolean, selected: boolean }): string {
            return arrayFilter([
                'relative truncate text-left py-2 pl-3 cursor-pointer select-none pr-9 focus:outline-none',
                active ? 'text-white bg-green-600' : 'text-gray-900',
                selected && 'font-medium',
            ]).join(' ');
        },
        updateSelectedOption(value: string) {
            this.$emit('update:modelValue', value);
        },
    },
});
</script>
