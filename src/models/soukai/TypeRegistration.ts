import { FieldType } from 'soukai';
import { SolidModel } from 'soukai-solid';

export default class TypeRegistration extends SolidModel {

    public static rdfContexts = { solid: 'http://www.w3.org/ns/solid/terms#' };
    public static rdfsClasses = ['TypeRegistration'];
    public static timestamps = false;
    public static fields = {
        forClass: {
            type: FieldType.Key,
            required: true,
        },
        instanceContainer: {
            type: FieldType.Key,
            required: true,
        },
    };

}
