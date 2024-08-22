import {
    AbstractViewController,
    Card,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { FormCardViewController } from '@sprucelabs/spruce-form-utils'

export default class DetailsFormCardViewController extends AbstractViewController<Card> {
    private cardVc: FormCardViewController
    public constructor(options: ViewControllerOptions) {
        super(options)
        this.getVcFactory().setController('forms.card', FormCardViewController)
        this.cardVc = this.Controller('forms.card', {
            id: 'details',
            fields: [],
            schema: {
                id: 'detailsForm',
                fields: {},
            },
        })
    }

    public render(): Card {
        return this.cardVc.render()
    }
}
