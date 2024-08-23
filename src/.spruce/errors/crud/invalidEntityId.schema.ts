import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const invalidEntityIdSchema: SpruceErrors.Crud.InvalidEntityIdSchema  = {
	id: 'invalidEntityId',
	namespace: 'Crud',
	name: 'Invalid Entity id',
	    fields: {
	            /** . */
	            'entityId': {
	                type: 'id',
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(invalidEntityIdSchema)

export default invalidEntityIdSchema
