import { reactive, toRaw, watch } from 'vue';
import { Storage } from '@noeldemartin/utils';
import type { Reactive } from 'vue';

export default function persistent<T extends object>(name: string, defaults: T): Reactive<T> {
    const store = reactive<T>(Storage.get<T>(name) ?? defaults);

    watch(store, () => Storage.set(name, toRaw(store)));

    return store;
}
