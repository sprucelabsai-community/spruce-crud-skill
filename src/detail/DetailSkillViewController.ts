import {
    AbstractSkillViewController,
    buildSkillViewLayout,
    SkillView,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { FormCardViewControllerOptions } from '@sprucelabs/spruce-form-utils'
import DetailsFormCardViewController from './DetailFormCardViewController'

export default class DetailSkillViewController extends AbstractSkillViewController {
    private detailsCardVc: DetailsFormCardViewController

    public constructor(
        options: ViewControllerOptions & DetailSkillViewControllerOptions
    ) {
        super(options)
        assertOptions(options, ['entities'])
        this.detailsCardVc = this.Controller('crud.detail-form-card', {})
    }

    public render(): SkillView {
        return buildSkillViewLayout('big-left', {
            leftCards: [this.detailsCardVc.render()],
        })
    }
}

export interface DetailSkillViewControllerOptions {
    entities: DetailSkillViewEntity[]
}

export interface DetailSkillViewEntity {
    id: string
    form: FormCardViewControllerOptions
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.detail-skill-view': DetailSkillViewController
    }

    interface ViewControllerMap {
        'crud.detail-skill-view': DetailSkillViewController
    }

    interface ViewControllerOptionsMap {
        'crud.detail-skill-view': DetailSkillViewControllerOptions
    }
}
