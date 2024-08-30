import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    buildForm,
} from '@sprucelabs/heartwood-view-controllers'
import {
    Location,
    locationSchema,
    Organization,
    organizationSchema,
} from '@sprucelabs/spruce-core-schemas'
import CrudDetailFormCardViewController from '../detail/CrudDetailFormCardViewController'
import CrudDetailSkillViewController, {
    CrudDetailSkillViewArgs,
    CrudDetailSkillViewEntity,
} from '../detail/CrudDetailSkillViewController'
import CrudListCardViewController from '../master/CrudListCardViewController'
import { locationListOptions } from './constants'

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

        this.getVcFactory().setController(
            'crud.list-card',
            CrudListCardViewController
        )

        this.detailSkillView = this.Controller('crud.detail-skill-view', {
            cancelDestination: 'crud.root',
            entities: [
                this.buildLocationDetailEntity(),
                this.buildOrganizationDetailEntity(),
            ],
        })
    }

    private buildOrganizationDetailEntity(): CrudDetailSkillViewEntity {
        return {
            id: 'organizations',
            form: buildForm({
                id: 'organizationsForm',
                schema: organizationSchema,
                sections: [
                    {
                        fields: ['name', 'address'],
                    },
                ],
            }),
            renderTitle: (values?: Organization) =>
                `${values ? `Update ${values.name}` : `Add Organization`}`,
            load: {
                fqen: 'get-organization::v2020_12_25',
                responseKey: 'organization',
                buildTarget: (organizationId) => ({
                    organizationId,
                }),
            },
            relatedEntities: [
                {
                    id: 'locations',
                    pluralTitle: 'aoeu',
                    singularTitle: 'aoeu',
                    list: {
                        ...locationListOptions,
                        payload: undefined,
                    },
                },
            ],
        }
    }

    private buildLocationDetailEntity(): CrudDetailSkillViewEntity {
        return {
            id: 'locations',
            renderTitle: (values?: Location) =>
                `${values ? `Update ${values.name}` : `Add Location`}`,
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
                fqen: 'get-location::v2020_12_25',
                responseKey: 'location',
                buildTarget: (locationId) => ({
                    locationId,
                }),
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
