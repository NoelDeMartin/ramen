import { MultiModelRelation } from 'soukai';
import { SolidContainerModel, SolidContainsRelation } from 'soukai-solid';

import Recipe from '@/models/soukai/Recipe';

export default class Cookbook extends SolidContainerModel {

    public recipes?: Recipe[];
    public relatedRecipes!: SolidContainsRelation<Cookbook, Recipe, typeof Recipe>;

    public recipesRelationship(): MultiModelRelation {
        return this.contains(Recipe);
    }

}
