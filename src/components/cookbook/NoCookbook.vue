<template>
    <i-twemoji-cook class="h-20 w-20" />
    <AGMarkdown lang-key="cookbook.notFound" class="text-center text-3xl font-light leading-snug" />
    <AGForm
        :form="form"
        class="mt-6 flex flex-col items-center gap-2 md:mt-0 md:flex-row"
        @submit="$ui.loading($t('cookbook.creating'), $cookbook.create(form.url))"
    >
        <TextButton submit>
            {{ $t('cookbook.create') }}
        </TextButton>
        <span>{{ $t('cookbook.createSeparator') }}</span>
        <InlineSelect name="url" :options="options" />
    </AGForm>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { Solid } from '@aerogel/plugin-solid';
import { requiredStringInput, translate, useForm } from '@aerogel/core';

const addValue = translate('cookbook.addUrl');
const activeUrl = ref();
const options = ref([...Solid.requireUser().storageUrls, addValue]);
const form = useForm({ url: requiredStringInput(options.value[0]) });

function addUrl() {
    form.url = prompt(translate('cookbook.addUrlPrompt')) ?? activeUrl.value;

    if (options.value.includes(form.url)) {
        return;
    }

    options.value.splice(-1, 0, form.url);
}

function updateActiveUrl() {
    activeUrl.value = form.url;
}

watchEffect(() => (form.url === addValue ? addUrl() : updateActiveUrl()));
</script>
