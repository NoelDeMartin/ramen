<template>
    <a
        target="_blank"
        :href="$cookbook.ramen?.url"
        :aria-label="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
        :title="$t('cookbook.seeRamen', { url: $cookbook.ramen?.url })"
    >
        <i-twemoji-steaming-bowl class="h-20 w-20" />
    </a>
    <AGMarkdown class="text-xl" lang-key="cookbook.ramen" />
</template>
