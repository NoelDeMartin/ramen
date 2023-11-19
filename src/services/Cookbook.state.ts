import { defineServiceState } from '@aerogel/core';

import type Recipe from '@/models/Recipe';
import type RecipesContainer from '@/models/RecipesContainer';

export default defineServiceState({
    name: 'cookbook',
    initialState: {
        container: null as RecipesContainer | null,
        ramen: null as Recipe | null,
    },
});
