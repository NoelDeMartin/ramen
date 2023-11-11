import { defineServiceState } from '@aerogel/core';

import type RecipesContainer from '@/models/RecipesContainer';

export default defineServiceState({
    name: 'cookbook',
    initialState: {
        container: null as RecipesContainer | null,
    },
});
