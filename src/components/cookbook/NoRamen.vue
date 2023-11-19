<template>
    <i-twemoji-crying-face class="h-20 w-20" />
    <AGMarkdown class="text-xl" lang-key="cookbook.noRamen" />
    <AGButton @click="$ui.loading($t('cookbook.addingRamen'), $cookbook.learnRamen())">
        {{ $t('cookbook.addRamen') }}
    </AGButton>
</template>
