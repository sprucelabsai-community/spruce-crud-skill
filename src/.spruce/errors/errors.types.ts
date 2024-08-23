import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.Crud {

	
	export interface InvalidEntityId {
		
			
			'entityId'?: string| undefined | null
	}

	export interface InvalidEntityIdSchema extends SpruceSchema.Schema {
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

	export type InvalidEntityIdEntity = SchemaEntity<SpruceErrors.Crud.InvalidEntityIdSchema>

}




