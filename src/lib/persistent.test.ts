import { describe, expect, it } from 'vitest';

import persistent from './persistent';
import { Storage } from '@noeldemartin/utils';
import { nextTick } from 'vue';

describe('persistent helper', () => {

    it('serializes to localStorage', async () => {
        // Arrange
        const store = persistent<{ foo?: string }>('foobar', {});

        // Act
        store.foo = 'bar';

        await nextTick();

        // Assert
        expect(Storage.get('foobar')).toEqual({ foo: 'bar' });
    });

    it('reads from localStorage', async () => {
        // Arrange
        Storage.set('foobar', { foo: 'bar' });

        // Act
        const store = persistent<{ foo?: string }>('foobar', {});

        // Assert
        expect(store.foo).toEqual('bar');
    });

});
