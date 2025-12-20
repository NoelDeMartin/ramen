<template>
    <i-twemoji-cook class="size-20" />
    <Markdown lang-key="cookbook.notFound" class="text-center text-3xl leading-snug font-light" />
    <Form
        :form="form"
        class="mt-6 flex flex-col items-center gap-2 md:mt-0 md:flex-row"
        @submit="$ui.loading($t('cookbook.creating'), $cookbook.create(form.url))"
    >
        <Button submit>
            {{ $t('cookbook.create') }}
        </Button>
        <span>{{ $t('cookbook.createSeparator') }}</span>
        <InlineSelect name="url" :options="options" />
    </Form>
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
