import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'invalidEntityId',
    name: 'Invalid Entity id',
    fields: {
        entityId: {
            type: 'id',
        },
    },
})
