<template>
    <a
        target="_blank"
        :href="$cookbook.ramen?.url"
        :aria-label="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
        :title="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
    >
        <i-twemoji-steaming-bowl class="size-40" />
    </a>
    <Markdown class="text-center text-4xl leading-snug font-light" lang-key="cookbook.ramen" />
</template>
