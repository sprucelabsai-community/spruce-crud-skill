import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import MasterListCardViewController from '../master/MasterListCardViewController'
import MasterSkillViewController, {
    buildMasterListEntity,
} from '../master/MasterSkillViewController'

export default class RootSkillViewController extends AbstractSkillViewController {
    public static id = 'root'
    private masterSkillView: MasterSkillViewController

    public constructor(options: ViewControllerOptions) {
        super(options)

        this.getVcFactory().setController(
            'crud.master-skill-view',
            MasterSkillViewController
        )
        this.getVcFactory().setController(
            'crud.master-list-card',
            MasterListCardViewController
        )
        this.masterSkillView = this.MasterVc()
    }

    private MasterVc(): MasterSkillViewController {
        return this.Controller('crud.master-skill-view', {
            entities: [
                buildMasterListEntity({
                    id: 'organizations',
                    title: 'Organizations',
                    load: {
                        fqen: 'list-organizations::v2020_12_25',
                        responseKey: 'organizations',
                        rowTransformer: (organization) => ({
                            id: organization.id,
                            cells: [
                                {
                                    text: {
                                        content: organization.name,
                                    },
                                },
                            ],
                        }),
                    },
                }),
            ],
        })
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await this.masterSkillView.load(options)
    }

    public render(): SkillView {
        return this.masterSkillView.render()
    }
}
