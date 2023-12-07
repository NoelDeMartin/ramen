<template>
    <i-twemoji-crying-face class="h-20 w-20" />
    <AGMarkdown class="text-3xl font-light" lang-key="cookbook.noRamen" />
    <FormButton @click="$ui.loading($t('cookbook.addingRamen'), $cookbook.learnRamen())">
        {{ $t('cookbook.addRamen') }}
    </FormButton>
</template>
