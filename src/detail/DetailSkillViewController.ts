import {
    AbstractSkillViewController,
    buildSkillViewLayout,
    SkillView,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import DetailsFormCardViewController from './DetailFormCardViewController'

export default class DetailSkillViewController extends AbstractSkillViewController {
    private detailsCardVc: DetailsFormCardViewController
    public constructor(options: ViewControllerOptions) {
        super(options)

        this.detailsCardVc = this.Controller('crud.detail-form-card', {})
    }

    public render(): SkillView {
        return buildSkillViewLayout('big-left', {
            leftCards: [this.detailsCardVc.render()],
        })
    }
}
