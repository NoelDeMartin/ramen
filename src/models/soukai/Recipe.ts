import RecipeInstructionsStep from '@/models/soukai/RecipeInstructionsStep';
import { stringToSlug, urlResolve } from '@noeldemartin/utils';
import { Relation } from 'soukai';
import { SolidBelongsToManyRelation } from 'soukai-solid';

import Model from './Recipe.schema';

export default class Recipe extends Model {

    public static rdfContexts = { schema: 'https://schema.org/' };
    public static rdfsClasses = ['Recipe'];

    declare public instructions?: RecipeInstructionsStep[];
    declare public relatedInstructions: SolidBelongsToManyRelation<
        this,
        RecipeInstructionsStep,
        typeof RecipeInstructionsStep
    >;

    public instructionsRelationship(): Relation {
        return this
            .belongsToMany(RecipeInstructionsStep, 'instructionSteps')
            .onDelete('cascade')
            .usingSameDocument(true);
    }

    protected newUrl(documentUrl?: string, resourceHash?: string): string {
        documentUrl = documentUrl ?? urlResolve(this.static().collection, stringToSlug(this.name));
        resourceHash = resourceHash ?? this.static().defaultResourceHash;

        return `${documentUrl}#${resourceHash}`;
    }

}
