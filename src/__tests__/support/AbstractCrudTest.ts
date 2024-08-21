import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import MockMasterListCard from './MockMasterListCard'
import SpyMasterSkillView from './SpyMasterSkillView'
import { buildLocationTestEntity } from './test.utils'

export default abstract class AbstractCrudTest extends AbstractSpruceFixtureTest {
    protected static async beforeEach() {
        await super.beforeEach()

        this.views.setController('crud.master-skill-view', SpyMasterSkillView)
        this.views.setController('crud.master-list-card', MockMasterListCard)
    }

    protected static buildEntities(total: number) {
        return Array.from({ length: total }, () =>
            this.buildLocationTestEntity()
        )
    }

    protected static buildLocationTestEntity(id?: string) {
        return buildLocationTestEntity(id)
    }
}
