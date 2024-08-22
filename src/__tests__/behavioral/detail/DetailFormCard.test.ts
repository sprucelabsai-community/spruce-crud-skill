import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { FormCardViewController } from '@sprucelabs/spruce-form-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import AbstractCrudTest from '../../support/AbstractCrudTest'

@fake.login()
export default class DetailFormCardTest extends AbstractCrudTest {
    @test()
    protected static async rendersAsFormCard() {
        const vc = this.views.Controller('crud.detail-form-card', {})
        vcAssert.assertRendersAsInstanceOf(vc, FormCardViewController)
    }
}
