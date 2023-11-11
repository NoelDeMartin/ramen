<template>
    <div class="flex flex-col items-center space-y-4">
        <i-twemoji-cook class="h-20 w-20" />
        <p v-if="$cookbook.container" class="mt-4 text-xl">
            <AGMarkdown
                :text="`Found some recipes on [${$cookbook.container.name ?? $cookbook.container.url}](${
                    $cookbook.container.url
                })`"
            />
        </p>
        <AGMarkdown v-else lang-key="cookbook.notFound" class="text-3xl font-light" />
    </div>
</template>
