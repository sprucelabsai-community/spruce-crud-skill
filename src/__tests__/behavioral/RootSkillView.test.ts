import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { generateId, test } from '@sprucelabs/test-utils'
import crudAssert from '../../assertions/crudAssert'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import AbstractCrudTest from '../support/AbstractCrudTest'
import { ListSkill } from '../support/EventFaker'

@fake.login()
export default class RootSkillViewTest extends AbstractCrudTest {
    private static vc: RootSkillViewController
    private static fakedListSkills: ListSkill[]

    protected static async beforeEach() {
        await super.beforeEach()

        crudAssert.beforeEach(this.views)
        this.vc = this.views.Controller('crud.root', {})

        this.fakedListSkills = []

        await this.eventFaker.fakeListSkills(() => this.fakedListSkills)
    }

    @test()
    protected static async requiresLogin() {
        await vcAssert.assertLoginIsRequired(this.vc)
    }

    @test()
    protected static async rendersMaster() {
        crudAssert.skillViewRendersMasterView(this.vc, {
            clickRowDestination: 'crud.detail',
            addDestination: 'crud.detail',
        })
    }

    @test()
    protected static async loadsMasterOnLoad() {
        await crudAssert.skillViewLoadsMasterView(this.vc)
    }

    @test()
    protected static async rendersOrganizationsListCard() {
        await crudAssert.masterSkillViewRendersList(this.vc, 'organizations', {
            pluralTitle: 'Organizations',
            list: {
                fqen: 'list-organizations::v2020_12_25',
                responseKey: 'organizations',
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
            },
        })
    }

    @test()
    @seed('organizations', 1)
    protected static async rendersOrganizationsRow() {
        await crudAssert.masterListCardRendersRow(
            this.vc,
            'organizations',
            this.fakedOrganizations[0].id
        )
    }

    @test()
    protected static async rendersLocationsListCard() {
        await crudAssert.masterSkillViewRendersList(this.vc, 'locations', {
            pluralTitle: 'Locations',
            list: {
                fqen: 'list-locations::v2020_12_25',
                responseKey: 'locations',
                payload: {
                    shouldOnlyShowWhereIAmEmployed: true,
                },
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
            },
        })
    }

    @test()
    @seed('locations', 1)
    protected static async rendersLocationsRow() {
        await crudAssert.masterListCardRendersRow(
            this.vc,
            'locations',
            this.fakedLocations[0].id
        )
    }

    @test()
    protected static async rendersSkillsListCard() {
        await crudAssert.masterSkillViewRendersList(this.vc, 'skills', {
            pluralTitle: 'Skills',
            list: {
                fqen: 'list-skills::v2020_12_25',
                responseKey: 'skills',
                paging: {
                    pageSize: 5,
                    shouldPageClientSide: true,
                },
            },
        })
    }

    @test()
    protected static async rendersListRow() {
        this.fakedListSkills.push({
            id: generateId(),
            name: generateId(),
            slug: generateId(),
            dateCreated: Date.now(),
        })

        await crudAssert.masterListCardRendersRow(
            this.vc,
            'skills',
            this.fakedListSkills[0].id
        )
    }
}
