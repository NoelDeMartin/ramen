import { SolidContainer } from 'soukai-solid';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import Recipe from '@/models/Recipe';

export default class RecipesContainer extends SolidContainer {

    declare public recipes?: Recipe[];
    declare public relatedRecipes: SolidContainsRelation<RecipesContainer, Recipe, typeof Recipe>;

    public recipesRelationship(): Relation {
        return this.contains(Recipe);
    }

}
