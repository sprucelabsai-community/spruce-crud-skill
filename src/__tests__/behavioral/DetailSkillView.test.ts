import { buildForm } from '@sprucelabs/heartwood-view-controllers'
import { locationSchema } from '@sprucelabs/spruce-core-schemas'
import {
    AbstractSpruceFixtureTest,
    fake,
} from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import { crudAssert } from '../../index-module'
import DetailSkillViewController from '../../skillViewControllers/Detail.svc'

@fake.login()
export default class DetailSkillViewTest extends AbstractSpruceFixtureTest {
    private static vc: DetailSkillViewController
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        crudAssert.beforeEach(this.views)
        this.vc = this.views.Controller('crud.detail', {})
    }

    @test()
    protected static async rendersDetailSkillView() {
        crudAssert.skillViewRendersDetailView(this.vc, {
            cancelDestination: 'crud.root',
            entities: [this.buildExpectedLocationSentity()],
        })
    }

    private static buildExpectedLocationSentity() {
        return {
            id: 'locations',
            form: buildForm({
                id: 'locationsForm',
                schema: locationSchema,
                sections: [
                    {
                        fields: ['name', 'timezone', 'address'],
                    },
                ],
            }),
        }
    }

    @test()
    protected static async loadsDetailSkillView() {
        await crudAssert.skillViewLoadsDetailView(this.vc)
    }
}
