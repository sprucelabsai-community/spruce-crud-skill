import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import DetailFormCardViewController from '../../../detail/DetailFormCardViewController'
import DetailSkillViewController from '../../../detail/DetailSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'

@fake.login()
export default class DetailSkillViewTest extends AbstractCrudTest {
    private static vc: DetailSkillViewController

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.vc = this.views.Controller('crud.detail-skill-view', {})
    }

    @test()
    protected static async rendersDetailsFormCard() {
        const detailsVc = vcAssert.assertSkillViewRendersCard(
            this.vc,
            'details'
        )

        vcAssert.assertRendersAsInstanceOf(
            detailsVc,
            DetailFormCardViewController
        )
    }
}
