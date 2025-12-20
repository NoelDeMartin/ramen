<template>
    <i-twemoji-crying-face class="size-20" />
    <Markdown lang-key="cookbook.noRamen" class="text-center text-3xl leading-snug font-light" />
    <Button @click="$ui.loading($t('cookbook.addingRamen'), $cookbook.learnRamen())">
        {{ $t('cookbook.addRamen') }}
    </Button>
</template>
