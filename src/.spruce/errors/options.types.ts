import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface InvalidEntityIdErrorOptions extends SpruceErrors.Crud.InvalidEntityId, ISpruceErrorOptions {
	code: 'INVALID_ENTITY_ID'
}

type ErrorOptions =  | InvalidEntityIdErrorOptions 

export default ErrorOptions
