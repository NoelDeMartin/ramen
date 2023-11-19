import { SolidContainer } from 'soukai-solid';
import type { Relation } from 'soukai';
import type { SolidContainsRelation } from 'soukai-solid';

import Recipe from '@/models/Recipe';

export default class RecipesContainer extends SolidContainer {

    public declare recipes?: Recipe[];
    public declare relatedRecipes: SolidContainsRelation<RecipesContainer, Recipe, typeof Recipe>;

    public recipesRelationship(): Relation {
        return this.contains(Recipe);
    }

}
