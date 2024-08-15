import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
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
                    id: 'locations',
                    title: 'Locations',
                    load: {
                        fqen: 'list-locations::v2020_12_25',
                        responseKey: 'locations',
                        rowTransformer: (location) => ({
                            id: location.id,
                            cells: [
                                {
                                    text: {
                                        content: location.name,
                                    },
                                },
                            ],
                        }),
                    },
                }),
            ],
        })
    }

    public render(): SkillView {
        return this.masterSkillView.render()
    }
}
