/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/order */

export { SpruceSchemas } from '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types'

import { default as SchemaEntity } from '@sprucelabs/schema'



import * as SpruceSchema from '@sprucelabs/schema'

import '@sprucelabs/spruce-event-utils'
import { SkillViewControllerId } from '@sprucelabs/heartwood-view-controllers'

declare module '@sprucelabs/spruce-core-schemas/build/.spruce/schemas/core.schemas.types' {


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface DidRegisterSkillViewsEmitTarget {
			
				
				'personId': string
		}

		interface DidRegisterSkillViewsEmitTargetSchema extends SpruceSchema.Schema {
			id: 'didRegisterSkillViewsEmitTarget',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'personId': {
			                type: 'id',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface DidRegisterSkillViewsEmitTargetEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitTargetSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface DidRegisterSkillViewsEmitPayload {
			
				/** View namespace. */
				'namespace': string
		}

		interface DidRegisterSkillViewsEmitPayloadSchema extends SpruceSchema.Schema {
			id: 'didRegisterSkillViewsEmitPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** View namespace. */
			            'namespace': {
			                label: 'View namespace',
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface DidRegisterSkillViewsEmitPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface DidRegisterSkillViewsEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'target': SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitTarget
				
				'payload': SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitPayload
		}

		interface DidRegisterSkillViewsEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'didRegisterSkillViewsEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'target': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitTargetSchema,}
			            },
			            /** . */
			            'payload': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitPayloadSchema,}
			            },
			    }
		}

		interface DidRegisterSkillViewsEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.DidRegisterSkillViewsEmitTargetAndPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GenerateUrlEmitTarget {
			
				/** Skill View Id. */
				'skillViewId'?: (SkillViewControllerId)| undefined | null
		}

		interface GenerateUrlEmitTargetSchema extends SpruceSchema.Schema {
			id: 'generateUrlEmitTarget',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			importsWhenRemote: ['import { SkillViewControllerId } from \'@sprucelabs/heartwood-view-controllers\'',],
			    fields: {
			            /** Skill View Id. */
			            'skillViewId': {
			                label: 'Skill View Id',
			                type: 'raw',
			                options: {valueType: `SkillViewControllerId`,}
			            },
			    }
		}

		interface GenerateUrlEmitTargetEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitTargetSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GenerateUrlEmitPayload {
			
				/** Load args. */
				'args'?: (Record<string, any>)| undefined | null
		}

		interface GenerateUrlEmitPayloadSchema extends SpruceSchema.Schema {
			id: 'generateUrlEmitPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Load args. */
			            'args': {
			                label: 'Load args',
			                type: 'raw',
			                options: {valueType: `Record<string, any>`,}
			            },
			    }
		}

		interface GenerateUrlEmitPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GenerateUrlResponsePayload {
			
				/** Url. */
				'url': string
		}

		interface GenerateUrlResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'generateUrlResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Url. */
			            'url': {
			                label: 'Url',
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface GenerateUrlResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetActiveThemeEmitTarget {
			
				
				'organizationId': string
		}

		interface GetActiveThemeEmitTargetSchema extends SpruceSchema.Schema {
			id: 'getActiveThemeEmitTarget',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'organizationId': {
			                type: 'id',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface GetActiveThemeEmitTargetEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetActiveThemeEmitTargetSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetActiveThemeEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'target': SpruceSchemas.Heartwood.v2021_02_11.GetActiveThemeEmitTarget
		}

		interface GetActiveThemeEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'getActiveThemeEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'target': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.GetActiveThemeEmitTargetSchema,}
			            },
			    }
		}

		interface GetActiveThemeEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetActiveThemeEmitTargetAndPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetActiveThemeResponsePayload {
			
				
				'theme'?: SpruceSchemas.Heartwood.v2021_02_11.Theme| undefined | null
		}

		interface GetActiveThemeResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'getActiveThemeResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'theme': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.ThemeSchema,}
			            },
			    }
		}

		interface GetActiveThemeResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetActiveThemeResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface UpsertThemeResponsePayload {
			
				
				'theme': SpruceSchemas.Heartwood.v2021_02_11.Theme
		}

		interface UpsertThemeResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'upsertThemeResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'theme': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.ThemeSchema,}
			            },
			    }
		}

		interface UpsertThemeResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetViewControllersEmitTarget {
			
				
				'namespace': string
		}

		interface GetViewControllersEmitTargetSchema extends SpruceSchema.Schema {
			id: 'getViewControllersEmitTarget',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'namespace': {
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface GetViewControllersEmitTargetEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetViewControllersEmitTargetSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetSkillViewsEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'target': SpruceSchemas.Heartwood.v2021_02_11.GetViewControllersEmitTarget
		}

		interface GetSkillViewsEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'getSkillViewsEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'target': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.GetViewControllersEmitTargetSchema,}
			            },
			    }
		}

		interface GetSkillViewsEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetSkillViewsEmitTargetAndPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GetSkillViewsResponsePayload {
			
				
				'id': string
				
				'ids': string[]
				
				'source'?: string| undefined | null
				
				'sourceUrl'?: string| undefined | null
				
				'theme'?: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.Theme| undefined | null
		}

		interface GetSkillViewsResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'getSkillViewsResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'id': {
			                type: 'id',
			                isRequired: true,
			                options: undefined
			            },
			            /** . */
			            'ids': {
			                type: 'text',
			                isRequired: true,
			                isArray: true,
			                options: undefined
			            },
			            /** . */
			            'source': {
			                type: 'text',
			                options: undefined
			            },
			            /** . */
			            'sourceUrl': {
			                type: 'text',
			                options: undefined
			            },
			            /** . */
			            'theme': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.ThemeSchema,}
			            },
			    }
		}

		interface GetSkillViewsResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GetSkillViewsResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface ListViewsResult {
			
				
				'namespace': string
				/** Skill view ids. For now this is every view, but soon will be only skill views */
				'svcIds': string[]
				/** View ids. For now this is every view, but soon will be only views (not skill views) */
				'vcIds': string[]
		}

		interface ListViewsResultSchema extends SpruceSchema.Schema {
			id: 'listViewsResult',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'namespace': {
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			            /** Skill view ids. For now this is every view, but soon will be only skill views */
			            'svcIds': {
			                label: 'Skill view ids',
			                type: 'id',
			                isRequired: true,
			                hint: 'For now this is every view, but soon will be only skill views',
			                isArray: true,
			                minArrayLength: 0,
			                options: undefined
			            },
			            /** View ids. For now this is every view, but soon will be only views (not skill views) */
			            'vcIds': {
			                label: 'View ids',
			                type: 'id',
			                isRequired: true,
			                hint: 'For now this is every view, but soon will be only views (not skill views)',
			                isArray: true,
			                minArrayLength: 0,
			                options: undefined
			            },
			    }
		}

		interface ListViewsResultEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.ListViewsResultSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface ListViewsResponsePayload {
			
				
				'views': SpruceSchemas.Heartwood.v2021_02_11.ListViewsResult[]
		}

		interface ListViewsResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'listViewsResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'views': {
			                type: 'schema',
			                isRequired: true,
			                isArray: true,
			                minArrayLength: 0,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.ListViewsResultSchema,}
			            },
			    }
		}

		interface ListViewsResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.ListViewsResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface RegisterDashboardCardsResponsePayload {
			
				
				'vcIds': string[]
		}

		interface RegisterDashboardCardsResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'registerDashboardCardsResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'vcIds': {
			                type: 'id',
			                isRequired: true,
			                isArray: true,
			                minArrayLength: 0,
			                options: undefined
			            },
			    }
		}

		interface RegisterDashboardCardsResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.RegisterDashboardCardsResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface RegisterSkillViewsEmitPayload {
			
				
				'ids': string[]
				
				'source'?: string| undefined | null
				
				'sourceUrl'?: string| undefined | null
				
				'theme'?: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.Theme| undefined | null
		}

		interface RegisterSkillViewsEmitPayloadSchema extends SpruceSchema.Schema {
			id: 'registerSkillViewsEmitPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'ids': {
			                type: 'text',
			                isRequired: true,
			                isArray: true,
			                options: undefined
			            },
			            /** . */
			            'source': {
			                type: 'text',
			                options: undefined
			            },
			            /** . */
			            'sourceUrl': {
			                type: 'text',
			                options: undefined
			            },
			            /** . */
			            'theme': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.ThemeSchema,}
			            },
			    }
		}

		interface RegisterSkillViewsEmitPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.RegisterSkillViewsEmitPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface RegisterSkillViewsEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'payload': SpruceSchemas.Heartwood.v2021_02_11.RegisterSkillViewsEmitPayload
		}

		interface RegisterSkillViewsEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'registerSkillViewsEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'payload': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.RegisterSkillViewsEmitPayloadSchema,}
			            },
			    }
		}

		interface RegisterSkillViewsEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.RegisterSkillViewsEmitTargetAndPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface RegisterSkillViewsResponsePayload {
			
				/** . Views that were registered. Will match the number of ids you sent. */
				'totalRegistered': number
		}

		interface RegisterSkillViewsResponsePayloadSchema extends SpruceSchema.Schema {
			id: 'registerSkillViewsResponsePayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . Views that were registered. Will match the number of ids you sent. */
			            'totalRegistered': {
			                type: 'number',
			                isRequired: true,
			                hint: 'Views that were registered. Will match the number of ids you sent.',
			                options: undefined
			            },
			    }
		}

		interface RegisterSkillViewsResponsePayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.RegisterSkillViewsResponsePayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface GenerateUrlEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'target'?: SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitTarget| undefined | null
				
				'payload'?: SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitPayload| undefined | null
		}

		interface GenerateUrlEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'generateUrlEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'target': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitTargetSchema,}
			            },
			            /** . */
			            'payload': {
			                type: 'schema',
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitPayloadSchema,}
			            },
			    }
		}

		interface GenerateUrlEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.GenerateUrlEmitTargetAndPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface UpsertThemeEmitTarget {
			
				
				'organizationId': string
		}

		interface UpsertThemeEmitTargetSchema extends SpruceSchema.Schema {
			id: 'upsertThemeEmitTarget',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'organizationId': {
			                type: 'id',
			                isRequired: true,
			                options: undefined
			            },
			    }
		}

		interface UpsertThemeEmitTargetEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitTargetSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface Theme {
			
				
				'slug': string
				
				'name': string
				
				'props': SpruceSchemas.HeartwoodViewControllers.v2021_02_11.ThemeProps
		}

		interface ThemeSchema extends SpruceSchema.Schema {
			id: 'theme',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: 'Theme',
			    fields: {
			            /** . */
			            'slug': {
			                type: 'id',
			                isRequired: true,
			                options: undefined
			            },
			            /** . */
			            'name': {
			                type: 'text',
			                isRequired: true,
			                options: undefined
			            },
			            /** . */
			            'props': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.ThemePropsSchema,}
			            },
			    }
		}

		interface ThemeEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.ThemeSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface UpsertThemeEmitPayload {
			
				
				'theme': SpruceSchemas.Heartwood.v2021_02_11.Theme
		}

		interface UpsertThemeEmitPayloadSchema extends SpruceSchema.Schema {
			id: 'upsertThemeEmitPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** . */
			            'theme': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.ThemeSchema,}
			            },
			    }
		}

		interface UpsertThemeEmitPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitPayloadSchema> {}

	}


	namespace SpruceSchemas.Heartwood.v2021_02_11 {

		
		interface UpsertThemeEmitTargetAndPayload {
			
				/** Source. */
				'source'?: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSource| undefined | null
				
				'target': SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitTarget
				
				'payload': SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitPayload
		}

		interface UpsertThemeEmitTargetAndPayloadSchema extends SpruceSchema.Schema {
			id: 'upsertThemeEmitTargetAndPayload',
			version: 'v2021_02_11',
			namespace: 'Heartwood',
			name: '',
			    fields: {
			            /** Source. */
			            'source': {
			                label: 'Source',
			                type: 'schema',
			                options: {schema: SpruceSchemas.SpruceEventUtils.v2021_09_13.EventSourceSchema,}
			            },
			            /** . */
			            'target': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitTargetSchema,}
			            },
			            /** . */
			            'payload': {
			                type: 'schema',
			                isRequired: true,
			                options: {schema: SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitPayloadSchema,}
			            },
			    }
		}

		interface UpsertThemeEmitTargetAndPayloadEntity extends SchemaEntity<SpruceSchemas.Heartwood.v2021_02_11.UpsertThemeEmitTargetAndPayloadSchema> {}

	}

}
