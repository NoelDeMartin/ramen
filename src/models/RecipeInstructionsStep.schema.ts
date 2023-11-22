import { FieldType } from 'soukai';
import { defineSolidModelSchema } from 'soukai-solid';

export default defineSolidModelSchema({
    rdfContext: 'https://schema.org/',
    rdfsClass: 'HowToStep',
    fields: {
        text: {
            type: FieldType.String,
            required: true,
        },
        position: {
            type: FieldType.Number,
            required: true,
        },
    },
});
