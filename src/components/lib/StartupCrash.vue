<template>
    <div class="grid flex-grow place-items-center">
        <div class="flex flex-col items-center gap-4 p-8">
            <i-twemoji-face-screaming-in-fear class="mt-2 h-20 w-20" />
            <h1 class="text-center text-4xl text-red-600">
                {{ $t('startupCrash.title') }}
            </h1>
            <AGMarkdown :text="$t('startupCrash.message')" class="text-center text-gray-700" />
            <div class="flex flex-col space-y-4">
                <TextButton color="danger" @click="$ui.loading($app.reload())">
                    {{ $t('startupCrash.reload') }}
                </TextButton>
                <TextButton
                    v-if="$solid.isLoggedIn()"
                    color="danger"
                    @click="$ui.loading($app.reload({ autoReconnect: 'false' }))"
                >
                    {{ $t('startupCrash.reloadWithoutReconnect') }}
                </TextButton>
                <TextButton
                    v-if="$solid.isLoggedIn()"
                    color="danger"
                    @click="$ui.loading($solid.logout(true).then(() => $app.reload()))"
                >
                    {{ $t('startupCrash.logout') }}
                </TextButton>
                <TextButton color="danger" @click="$errors.inspect($errors.startupErrors)">
                    {{ $t('startupCrash.inspect') }}
                </TextButton>
            </div>
        </div>
    </div>
</template>
