import {
    AbstractViewController,
    Card,
    CardViewController,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { FormCardViewController } from '@sprucelabs/spruce-form-utils'
import { DetailForm } from './DetailSkillViewController'

export default class DetailFormCardViewController extends AbstractViewController<Card> {
    protected formCardVc?: FormCardViewController
    private cardVc: CardViewController
    private onCancelHandler: OnCancelHandler

    public constructor(
        options: ViewControllerOptions & DetailFormCardViewControllerOptions
    ) {
        super(options)

        const { onCancel } = assertOptions(options, ['onSubmit', 'onCancel'])

        this.onCancelHandler = onCancel

        const views = this.getVcFactory()
        if (!views.hasController('forms.card')) {
            views.setController('forms.card', FormCardViewController)
        }

        this.cardVc = this.Controller('card', {
            id: 'details',
            body: {
                isBusy: true,
            },
            footer: {
                buttons: [
                    {
                        id: 'cancel',
                        label: 'Cancel',
                    },
                ],
            },
        })
    }

    public async load(form: DetailForm) {
        assertOptions({ form }, ['form'])

        this.formCardVc = this.Controller('forms.card', {
            ...(form as any),
            id: 'details',
            onCancel: this.handleCancel.bind(this),
        })
        this.triggerRender()
    }

    private async handleCancel() {
        await this.onCancelHandler()
    }

    public render(): Card {
        return this.formCardVc?.render() ?? this.cardVc.render()
    }
}

type OnSubmitHandler = (values: Record<string, any>) => void | Promise<void>
type OnCancelHandler = () => void | Promise<void>

export interface DetailFormCardViewControllerOptions {
    onSubmit: OnSubmitHandler
    onCancel: OnCancelHandler
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.detail-form-card': DetailFormCardViewController
    }

    interface ViewControllerMap {
        'crud.detail-form-card': DetailFormCardViewController
    }

    interface ViewControllerOptionsMap {
        'crud.detail-form-card': DetailFormCardViewControllerOptions
    }
}
