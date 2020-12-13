import { stringToSlug, urlResolve } from '@noeldemartin/utils';
import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export default class Recipe extends SolidModel {

    public static rdfContexts = { schema: 'https://schema.org/' };
    public static rdfsClasses = ['Recipe'];
    public static fields = {
        name: {
            type: FieldType.String,
            required: true,
        },
        ingredients: {
            type: FieldType.Array,
            items: FieldType.String,
            rdfProperty: 'recipeIngredient',
        },
        instructions: {
            type: FieldType.String,
            rdfProperty: 'recipeInstructions',
        },
        externalUrls: {
            type: FieldType.Array,
            items: FieldType.String,
            rdfProperty: 'sameAs',
        },
    };

    protected newUrl(documentUrl?: string, resourceHash?: string): string {
        documentUrl = documentUrl ?? urlResolve(this.modelClass.collection, stringToSlug(this.name));
        resourceHash = resourceHash ?? this.modelClass.defaultResourceHash;

        return `${documentUrl}#${resourceHash}`;
    }

}
