import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import { crudAssert } from '../../index-module'
import AbstractCrudTest from '../support/AbstractCrudTest'

@fake.login()
export default class DetailExampleSkillViewTest extends AbstractCrudTest {
    @test()
    protected static async rendersDetailSkillView() {
        const vc = this.views.Controller('crud.detail-example', {})
        crudAssert.skillViewRendersDetailView(vc)
    }
}
