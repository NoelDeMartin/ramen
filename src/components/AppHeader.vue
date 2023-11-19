<template>
    <div v-if="$solid.isLoggedIn()" class="flex w-full justify-between px-4 py-2">
        <div>
            <div class="flex items-center text-sm" :title="$t('header.account', { webId: $solid.user.webId })">
                <i-zondicons-user class="mr-2 h-4 w-4" />
                <span class="sr-only">{{ $t('header.account', { webId: $solid.user.webId }) }}</span>
                <AGLink :href="$solid.user.webId">
                    {{ $solid.user.name ?? $solid.user.webId }}
                </AGLink>
            </div>
            <div
                v-if="$cookbook.hasCookbook()"
                class="flex items-center text-sm"
                :title="$t('header.cookbook', { url: $cookbook.container.url })"
            >
                <i-zondicons-book-reference class="mr-2 h-4 w-4" />
                <span class="sr-only">{{ $t('header.cookbook', { url: $cookbook.container.url }) }}</span>
                <AGLink :href="$cookbook.container.url">
                    {{ $cookbook.container.name ?? $cookbook.container.url }}
                </AGLink>
            </div>
        </div>
        <AGButton
            color="clear"
            class="rounded-full"
            :aria-label="$t('header.logout')"
            :title="$t('header.logout')"
            @click="$solid.logout()"
        >
            <i-mdi-logout class="h-7 w-7 text-red-700" />
        </AGButton>
    </div>
</template>
