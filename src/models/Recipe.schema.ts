import { belongsToMany, defineSchema } from 'soukai-bis';
import { array, string, url } from 'zod';

import RecipeInstructionsStep from './RecipeInstructionsStep';

export default defineSchema({
    rdfContext: 'https://schema.org/',
    rdfClass: 'Recipe',
    fields: {
        name: string().useAsSlug(),
        description: string().optional(),
        imageUrl: url().rdfProperty('image').optional(),
        servings: string().rdfProperty('recipeYield').optional(),
        prepTime: string().rdfProperty('prepTime').optional(),
        cookTime: string().rdfProperty('cookTime').optional(),
        ingredients: array(string()).rdfProperty('recipeIngredient').default([]),
        instructionStepUrls: array(url()).rdfProperty('recipeInstructions').default([]),
        externalUrls: array(url()).rdfProperty('sameAs').default([]),
    },
    relations: {
        instructions: belongsToMany(() => RecipeInstructionsStep, 'instructionStepUrls').usingSameDocument(),
    },
});
