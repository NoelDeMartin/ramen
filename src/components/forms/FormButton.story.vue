<template>
    <Story :layout="{ type: 'grid' }">
        <Variant title="Playground">
            <FormButton :color="color">
                {{ content }}
            </FormButton>

            <template #controls>
                <HstText v-model="content" title="Content" />
                <HstSelect v-model="color" title="Color" :options="colorOptions" />
            </template>
        </Variant>

        <Variant title="Default">
            <FormButton> Click me! </FormButton>
        </Variant>

        <Variant title="Hover">
            <FormButton class=":hover">
                Click me!
            </FormButton>
        </Variant>

        <Variant title="Focus">
            <FormButton class=":focus :focus-visible">
                Click me!
            </FormButton>
        </Variant>

        <Variant title="Colors" :layout="{ width: '300px' }">
            <div class="flex items-center gap-2">
                <FormButton color="primary">
                    Primary
                </FormButton>
                <FormButton color="secondary">
                    Secondary
                </FormButton>
                <FormButton color="solid">
                    Solid
                </FormButton>
                <FormButton color="danger">
                    Danger
                </FormButton>
                <FormButton color="clear">
                    Clear
                </FormButton>
            </div>
        </Variant>
    </Story>
</template>

<script setup lang="ts">
import { invert } from '@noeldemartin/utils';
import { ref } from 'vue';

import { Colors } from '@/lib/colors';
import type { Color } from '@/lib/colors';

const content = ref('Click me!');
const color = ref<Color>(Colors.Primary);
const colorOptions = invert(Colors);
</script>

<style>
.story-formbutton {
    grid-template-columns: repeat(3, 200px) !important;
}

.story-formbutton .variant-playground,
.story-formbutton .variant-colors {
    grid-column: 1 / -1;
}
</style>
