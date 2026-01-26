import { stringToSlug } from '@noeldemartin/utils';
import type { BelongsToManyRelation } from 'soukai-bis';

import Model from './Recipe.schema';
import type RecipeInstructionsStep from './RecipeInstructionsStep';

export default class Recipe extends Model {

    declare public relatedInstructions: BelongsToManyRelation<
        this,
        RecipeInstructionsStep,
        typeof RecipeInstructionsStep
    >;

    public isRamen(): boolean {
        return !!this.name && stringToSlug(this.name).includes('ramen');
    }

}
