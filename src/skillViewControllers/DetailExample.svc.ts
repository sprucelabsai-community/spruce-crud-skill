import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
} from '@sprucelabs/heartwood-view-controllers'
import DetailSkillViewController from '../detail/DetailSkillViewController'

export default class DetailExampleSkillViewController extends AbstractSkillViewController {
    public static id = 'detail-example'
    private detailSkillView: DetailSkillViewController

    public constructor(options: ViewControllerOptions) {
        super(options)
        this.detailSkillView = this.Controller('crud.detail-skill-view', {
            cancelDestination: 'crud.detail-example',
            entities: [
                {
                    form: {} as any,
                    id: 'aoeu',
                },
            ],
        })
    }

    public render(): SkillView {
        return this.detailSkillView.render()
    }
}
