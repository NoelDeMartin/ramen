<template>
    <div class="flex flex-grow items-center justify-center self-stretch p-10">
        <AppLoginError v-if="$solid.error" />
        <AppCookbook v-else-if="$solid.isLoggedIn()" />
        <AppLoginForm v-else />
    </div>
</template>
