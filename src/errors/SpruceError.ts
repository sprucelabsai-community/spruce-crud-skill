import AbstractSpruceError from '@sprucelabs/error'
import ErrorOptions from '#spruce/errors/options.types'

export default class SpruceError extends AbstractSpruceError<ErrorOptions> {
    public friendlyMessage(): string {
        const { options } = this
        let message

        switch (options?.code) {
            case 'INVALID_ENTITY_ID':
                message = `I could not find determine what you were trying to do! Sorry about that!`
                break

            default:
                message = super.friendlyMessage()
        }

        const fullMessage = options.friendlyMessage
            ? options.friendlyMessage
            : message

        return fullMessage
    }
}
