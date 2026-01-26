import 'soukai-bis/patch-zod';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryEngine, bootCoreModels, bootModels, setEngine } from 'soukai-bis';

import Recipe from './Recipe';

describe('Recipe model', () => {

    beforeEach(async () => {
        bootCoreModels(true);
        bootModels({ Recipe });
        setEngine(new InMemoryEngine());
    });

    it('identifies Ramen', () => {
        expect(new Recipe({ name: 'Ramen' }).isRamen()).toBe(true);
        expect(new Recipe({ name: 'Jun\'s Ramen' }).isRamen()).toBe(true);
        expect(new Recipe({ name: 'Pizza' }).isRamen()).toBe(false);
    });

});
