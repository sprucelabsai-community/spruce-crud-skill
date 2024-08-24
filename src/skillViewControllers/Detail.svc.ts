import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
} from '@sprucelabs/heartwood-view-controllers'
import CrudDetailFormCardViewController from '../detail/CrudDetailFormCardViewController'
import CrudDetailSkillViewController from '../detail/CrudDetailSkillViewController'

export default class DetailExampleSkillViewController extends AbstractSkillViewController {
    public static id = 'detail'
    private detailSkillView: CrudDetailSkillViewController

    public constructor(options: ViewControllerOptions) {
        super(options)

        this.getVcFactory().setController(
            'crud.detail-skill-view',
            CrudDetailSkillViewController
        )

        this.getVcFactory().setController(
            'crud.detail-form-card',
            CrudDetailFormCardViewController
        )

        this.detailSkillView = this.Controller('crud.detail-skill-view', {
            cancelDestination: 'crud.root',
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
