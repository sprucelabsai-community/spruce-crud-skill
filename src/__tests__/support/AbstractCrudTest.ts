import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { MasterSkilLViewEntity } from '../../master/MasterSkillViewController'
import MockMasterListCard from './MockMasterListCard'
import SpyMasterSkillView from './SpyMasterSkillView'
import { buildEntity } from './test.utils'

export default abstract class AbstractCrudTest extends AbstractSpruceFixtureTest {
    protected static async beforeEach() {
        await super.beforeEach()

        this.views.setController('crud.master-skill-view', SpyMasterSkillView)
        this.views.setController('crud.master-list-card', MockMasterListCard)
    }

    protected static buildEntities(total: number) {
        return Array.from({ length: total }, () => this.buildEntity())
    }

    protected static buildEntity(): MasterSkilLViewEntity {
        return buildEntity()
    }
}
