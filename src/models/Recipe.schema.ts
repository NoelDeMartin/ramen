import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfContext: 'https://schema.org/',
    rdfsClass: 'Recipe',
    slugField: 'name',
    fields: {
        name: {
            type: FieldType.String,
            required: true,
        },
        description: FieldType.String,
        imageUrl: {
            type: FieldType.Key,
            rdfProperty: 'schema:image',
        },
        servings: {
            type: FieldType.String,
            rdfProperty: 'schema:recipeYield',
        },
        prepTime: FieldType.String,
        cookTime: FieldType.String,
        ingredients: {
            type: FieldType.Array,
            rdfProperty: 'schema:recipeIngredient',
            items: FieldType.String,
        },
        instructionStepUrls: {
            type: FieldType.Array,
            items: FieldType.Key,
            rdfProperty: 'schema:recipeInstructions',
        },
        externalUrls: {
            type: FieldType.Array,
            rdfProperty: 'schema:sameAs',
            items: FieldType.Key,
        },
    },
});
