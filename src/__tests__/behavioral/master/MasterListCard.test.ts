import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import MasterListCardViewController from '../../../master/MasterListCardViewController'
import { MasterSkillViewListEntity } from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'

@fake.login()
export default class MasterListCardTest extends AbstractCrudTest {
    private static entity: MasterSkillViewListEntity
    private static vc: MasterListCardViewController

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.entity = this.buildEntity()
        this.vc = this.views.Controller('crud.master-list-card', {
            entity: this.entity,
        })
    }

    @test()
    protected static async setsTheTitleBasedOnEntityTitle() {
        const model = this.views.render(this.vc)
        assert.isEqual(model.header?.title, this.entity.title)
    }

    @test()
    protected static async rendersAnActiveRecordCard() {
        vcAssert.assertIsActiveRecordCard(this.vc)
    }
}
