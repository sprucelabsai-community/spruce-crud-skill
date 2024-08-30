import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import CrudListCardViewController from '../master/CrudListCardViewController'
import CrudMasterSkillViewController, {
    buildCrudListEntity,
} from '../master/CrudMasterSkillViewController'
import { locationListOptions } from './constants'

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
            'crud.list-card',
            CrudListCardViewController
        )

        this.masterSkillView = this.MasterVc()
    }

    public async getIsLoginRequired() {
        return true
    }

    private MasterVc(): CrudMasterSkillViewController {
        return this.Controller('crud.master-skill-view', {
            clickRowDestination: 'crud.detail',
            addDestination: 'crud.detail',
            entities: [
                this.buildOrganizationsListEntity(),
                this.buildLocationsListEntity(),
                this.buildSkillsListEntity(),
            ],
        })
    }

    private buildSkillsListEntity() {
        return buildCrudListEntity({
            id: 'skills',
            pluralTitle: 'Skills',
            singularTitle: 'Skill',
            list: {
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
        return buildCrudListEntity({
            id: 'locations',
            pluralTitle: 'Locations',
            singularTitle: 'Location',
            list: locationListOptions,
        })
    }

    private buildOrganizationsListEntity() {
        return buildCrudListEntity({
            id: 'organizations',
            pluralTitle: 'Organizations',
            singularTitle: 'Organization',
            list: {
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
