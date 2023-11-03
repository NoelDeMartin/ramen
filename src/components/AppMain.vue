<template>
    <div class="flex flex-grow items-center justify-center self-stretch p-10">
        <AppLoginError v-if="$solid.error" />
        <AGMarkdown
            v-else-if="$solid.isLoggedIn()"
            lang-key="welcome"
            :lang-params="{ name: $solid.user.name ?? $solid.user.webId, url: $solid.user.webId }"
        />
        <AppLoginForm v-else />
    </div>
</template>
