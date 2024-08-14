import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import AbstractCrudTest from '../../support/AbstractCrudTest'

@fake.login()
export default class MasterListCardTest extends AbstractCrudTest {
    @test()
    protected static async setsTheTitleBasedOnEntityTitle() {
        const entity = this.buildEntity()
        const vc = this.views.Controller('crud.master-list-card', {
            entity,
        })

        const model = this.views.render(vc)
        assert.isEqual(model.header?.title, entity.title)
    }
}
