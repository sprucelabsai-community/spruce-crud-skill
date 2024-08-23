import { buildForm } from '@sprucelabs/heartwood-view-controllers'
import { buildSchema } from '@sprucelabs/schema'

export const formSchema1 = buildSchema({
    id: 'testForm',
    fields: {
        id: {
            type: 'id',
            isRequired: true,
        },
    },
})

export const formSchema2 = buildSchema({
    id: 'testForm2',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
    },
})

export const detailFormOptions1 = buildForm({
    schema: formSchema1,
    sections: [],
})

export const detailFormOptions2 = buildForm({
    schema: formSchema2,
    sections: [
        {
            fields: ['firstName'],
        },
    ],
})
