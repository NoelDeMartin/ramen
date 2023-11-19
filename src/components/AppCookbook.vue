<template>
    <div class="flex flex-col items-center space-y-4">
        <NoCookbook v-if="!$cookbook.hasCookbook()" />
        <NoRamen v-else-if="!$cookbook.hasRamen()" />
        <Ramen v-else />
    </div>
</template>
