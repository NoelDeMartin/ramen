import { stringToSlug } from '@noeldemartin/utils';
import type { Relation } from 'soukai';
import type { SolidBelongsToManyRelation } from 'soukai-solid';

import RecipeInstructionsStep from '@/models/RecipeInstructionsStep';

import Model from './Recipe.schema';

export default class Recipe extends Model {

    declare public instructions?: RecipeInstructionsStep[];
    declare public relatedInstructions: SolidBelongsToManyRelation<
        Recipe,
        RecipeInstructionsStep,
        typeof RecipeInstructionsStep
    >;

    public isRamen(): boolean {
        return !!this.name && stringToSlug(this.name).includes('ramen');
    }

    public instructionsRelationship(): Relation {
        return this.belongsToMany(RecipeInstructionsStep, 'instructionStepUrls')
            .onDelete('cascade')
            .usingSameDocument(true);
    }

}
