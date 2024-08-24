import {
    AbstractSpruceFixtureTest,
    fake,
} from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import { crudAssert } from '../../index-module'

@fake.login()
export default class DetailExampleSkillViewTest extends AbstractSpruceFixtureTest {
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        crudAssert.beforeEach(this.views)
    }

    @test()
    protected static async rendersDetailSkillView() {
        const vc = this.views.Controller('crud.detail', {})
        crudAssert.skillViewRendersDetailView(vc, {
            cancelDestination: 'crud.root',
        })
    }
}
