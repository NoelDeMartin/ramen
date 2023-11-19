import { shortId, stringToSlug, urlResolve } from '@noeldemartin/utils';

import Model from './Recipe.schema';

export default class Recipe extends Model {

    public isRamen(): boolean {
        return !!this.name && stringToSlug(this.name).includes('ramen');
    }

    protected newUrl(documentUrl?: string, resourceHash?: string): string {
        documentUrl = documentUrl ?? urlResolve(this.static('collection'), stringToSlug(this.name) || shortId());
        resourceHash = resourceHash ?? this.static('defaultResourceHash');

        return `${documentUrl}#${resourceHash}`;
    }

}
