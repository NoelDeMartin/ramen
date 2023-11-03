<template>
    <div v-if="$solid.isLoggedIn()" class="flex w-full justify-between px-4 py-2">
        <div class="flex items-center text-sm" :title="$t('header.account', { webId: $solid.user.webId })">
            <i-zondicons-user class="mr-2 h-4 w-4" />
            <AGLink :href="$solid.user.webId">
                {{ $solid.user.name ?? $solid.user.webId }}
            </AGLink>
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
