import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import DetailFormCardViewController from '../../detail/DetailFormCardViewController'
import DetailSkillViewController from '../../detail/DetailSkillViewController'
import MockMasterListCard from './MockMasterListCard'
import SpyMasterSkillView from './SpyMasterSkillView'
import { buildLocationTestEntity } from './test.utils'

export default abstract class AbstractCrudTest extends AbstractSpruceFixtureTest {
    protected static async beforeEach() {
        await super.beforeEach()

        this.views.setController('crud.master-skill-view', SpyMasterSkillView)
        this.views.setController('crud.master-list-card', MockMasterListCard)
        this.views.setController(
            'crud.detail-skill-view',
            DetailSkillViewController
        )
        this.views.setController(
            'crud.detail-form-card',
            DetailFormCardViewController
        )
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
