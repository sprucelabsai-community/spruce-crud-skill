import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import MasterListCardViewController from '../master/CrudMasterListCardViewController'
import CrudMasterSkillViewController, {
    buildMasterListEntity,
} from '../master/CrudMasterSkillViewController'

export default class RootSkillViewController extends AbstractSkillViewController {
    public static id = 'root'
    private masterSkillView: CrudMasterSkillViewController

    public constructor(options: ViewControllerOptions) {
        super(options)

        this.getVcFactory().setController(
            'crud.master-skill-view',
            CrudMasterSkillViewController
        )

        this.getVcFactory().setController(
            'crud.master-list-card',
            MasterListCardViewController
        )

        this.masterSkillView = this.MasterVc()
    }

    private MasterVc(): CrudMasterSkillViewController {
        return this.Controller('crud.master-skill-view', {
            clickRowDestination: 'crud.detail',
            entities: [
                this.buildOrganizationsListEntity(),
                this.buildLocationsListEntity(),
                this.buildSkillsListEntity(),
            ],
        })
    }

    private buildSkillsListEntity() {
        return buildMasterListEntity({
            id: 'skills',
            title: 'Skills',
            load: {
                fqen: 'list-skills::v2020_12_25',
                responseKey: 'skills',
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
                rowTransformer: (skill) => ({
                    id: skill.id,
                    cells: [
                        {
                            text: {
                                content: skill.name,
                            },
                        },
                    ],
                }),
            },
        })
    }

    private buildLocationsListEntity() {
        return buildMasterListEntity({
            id: 'locations',
            title: 'Locations',
            load: {
                fqen: 'list-locations::v2020_12_25',
                responseKey: 'locations',
                payload: {
                    shouldOnlyShowWhereIAmEmployed: true,
                },
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
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
        })
    }

    private buildOrganizationsListEntity() {
        return buildMasterListEntity({
            id: 'organizations',
            title: 'Organizations',
            load: {
                fqen: 'list-organizations::v2020_12_25',
                responseKey: 'organizations',
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
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
        })
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await this.masterSkillView.load(options)
    }

    public render(): SkillView {
        return this.masterSkillView.render()
    }
}
