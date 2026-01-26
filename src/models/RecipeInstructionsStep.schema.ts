import { defineSchema } from 'soukai-bis';
import { number, string } from 'zod';

export default defineSchema({
    rdfContext: 'https://schema.org/',
    rdfClass: 'HowToStep',
    fields: {
        text: string(),
        position: number(),
    },
});
