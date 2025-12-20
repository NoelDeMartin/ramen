<template>
    <div v-if="$solid.isLoggedIn()" class="flex w-full justify-between p-4">
        <div class="flex flex-col">
            <div class="flex items-center text-sm" :title="$t('header.account', { webId: $solid.user.webId })">
                <i-zondicons-user class="mr-2 size-4" />
                <span class="sr-only">{{ $t('header.account', { webId: $solid.user.webId }) }}</span>
                <Link :href="$solid.user.webId" class="font-normal text-current">
                    {{ $solid.user.name ?? $solid.user.webId }}
                </Link>
            </div>
            <div
                v-if="$cookbook.hasCookbook()"
                class="flex items-center text-sm"
                :title="$t('header.cookbook', { url: $cookbook.container.url })"
            >
                <i-zondicons-book-reference class="mr-2 size-4" />
                <span class="sr-only">{{ $t('header.cookbook', { url: $cookbook.container.url }) }}</span>
                <Link :href="$cookbook.container.url" class="font-normal text-current">
                    {{ $cookbook.container.name ?? $cookbook.container.url }}
                </Link>
            </div>
        </div>
        <Button
            variant="ghost"
            class="translate-x-2 rounded-full"
            :aria-label="$t('header.logout')"
            :title="$t('header.logout')"
            @click="$solid.logout()"
        >
            <i-mdi-logout class="size-7 text-red-500" />
        </Button>
    </div>
</template>
