import '#spruce/permissions/permissions.types'
import generateUrlEmitTargetAndPayloadSchema from '#spruce/schemas/heartwood/v2021_02_11/generateUrlEmitTargetAndPayload.schema'
import generateUrlResponsePayloadSchema from '#spruce/schemas/heartwood/v2021_02_11/generateUrlResponsePayload.schema'
import { buildEventContract } from '@sprucelabs/mercury-types'


const generateUrlEventContract = buildEventContract({
    eventSignatures: {
        'heartwood.generate-url::v2021_02_11': {
            isGlobal: true,
            emitPermissions: {"contractId":"heartwood.skill-views","permissionIdsAny":["can-generate-url"]},
            
            emitPayloadSchema: generateUrlEmitTargetAndPayloadSchema,
            responsePayloadSchema: generateUrlResponsePayloadSchema,
            
            
        }
    }
})
export default generateUrlEventContract

export type GenerateUrlEventContract = typeof generateUrlEventContract