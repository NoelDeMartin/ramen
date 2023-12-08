<template>
    <i-twemoji-crying-face class="h-20 w-20" />
    <AGMarkdown lang-key="cookbook.noRamen" class="text-center text-3xl font-light leading-snug" />
    <TextButton @click="$ui.loading($t('cookbook.addingRamen'), $cookbook.learnRamen())">
        {{ $t('cookbook.addRamen') }}
    </TextButton>
</template>
