import { fake } from '@sprucelabs/spruce-test-fixtures'
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
}
