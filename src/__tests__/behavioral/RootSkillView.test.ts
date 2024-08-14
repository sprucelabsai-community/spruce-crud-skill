import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import crudAssert from '../../assertions/crudAssert'
import AbstractCrudTest from '../support/AbstractCrudTest'

@fake.login()
export default class RootSkillViewTest extends AbstractCrudTest {
    protected static async beforeEach() {
        await super.beforeEach()
        crudAssert.beforeEach(this.views)
    }

    @test()
    protected static async rendersMaster() {
        const vc = this.views.Controller('crud-views.root', {})
        crudAssert.skillViewRendersMasterView(vc)
    }
}
