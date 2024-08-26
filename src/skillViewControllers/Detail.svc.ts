import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    buildForm,
} from '@sprucelabs/heartwood-view-controllers'
import { locationSchema } from '@sprucelabs/spruce-core-schemas'
import CrudDetailFormCardViewController from '../detail/CrudDetailFormCardViewController'
import CrudDetailSkillViewController, {
    CrudDetailSkillViewArgs,
    CrudDetailSkillViewEntity,
} from '../detail/CrudDetailSkillViewController'

export default class DetailSkillViewController extends AbstractSkillViewController {
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
            entities: [this.buildLocationDetailEntity()],
        })
    }

    private buildLocationDetailEntity(): CrudDetailSkillViewEntity {
        return {
            id: 'locations',
            generateTitle: () => 'Add Location',
            form: buildForm({
                id: 'locationsForm',
                schema: locationSchema,
                sections: [
                    {
                        fields: ['name', 'timezone', 'address'],
                    },
                ],
            }),
            load: {
                fqen: 'list-locations::v2020_12_25',
                responseKey: 'locations',
            },
        }
    }

    public async load(
        options: SkillViewControllerLoadOptions<CrudDetailSkillViewArgs>
    ) {
        await this.detailSkillView.load(options)
        this.triggerRender()
    }

    public render(): SkillView {
        return this.detailSkillView.render()
    }
}
