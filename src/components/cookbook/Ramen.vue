<template>
    <a
        target="_blank"
        :href="$cookbook.ramen?.url"
        :aria-label="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
        :title="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
    >
        <i-twemoji-steaming-bowl class="h-40 w-40" />
    </a>
    <AGMarkdown class="mt-8 text-center text-4xl font-light leading-snug" lang-key="cookbook.ramen" />
</template>
