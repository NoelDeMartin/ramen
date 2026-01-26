import { contains, defineContainerSchema } from 'soukai-bis';

import Recipe from './Recipe';

export default defineContainerSchema({
    relations: {
        recipes: contains(Recipe),
    },
});
