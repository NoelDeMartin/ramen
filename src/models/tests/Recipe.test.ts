import { bootSolidModels } from 'soukai-solid';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryEngine, bootModels, setEngine } from 'soukai';

import Recipe from '../Recipe';

describe('Recipe model', () => {

    beforeEach(async () => {
        bootSolidModels();
        bootModels({ Recipe });
        setEngine(new InMemoryEngine());
    });

    it('identifies Ramen', () => {
        expect(new Recipe({ name: 'Ramen' }).isRamen()).toBe(true);
        expect(new Recipe({ name: 'Jun\'s Ramen' }).isRamen()).toBe(true);
        expect(new Recipe({ name: 'Pizza' }).isRamen()).toBe(false);
    });

});
