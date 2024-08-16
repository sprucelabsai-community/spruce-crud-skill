import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import crudAssert from '../../assertions/crudAssert'
import RootSkillViewController from '../../skillViewControllers/Root.svc'
import AbstractCrudTest from '../support/AbstractCrudTest'

@fake.login()
export default class RootSkillViewTest extends AbstractCrudTest {
    private static vc: RootSkillViewController

    protected static async beforeEach() {
        await super.beforeEach()
        crudAssert.beforeEach(this.views)
        this.vc = this.views.Controller('crud-views.root', {})
    }

    @test()
    protected static async rendersMaster() {
        crudAssert.skillViewRendersMasterView(this.vc)
    }

    @test()
    protected static async loadsMasterOnLoad() {
        await crudAssert.skillViewLoadsMasterView(this.vc)
    }

    @test()
    protected static async loadsOrganizationsListCard() {
        await crudAssert.masterSkillViewRendersList(this.vc, 'organizations', {
            title: 'Organizations',
            load: {
                fqen: 'list-organizations::v2020_12_25',
                responseKey: 'organizations',
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
}
