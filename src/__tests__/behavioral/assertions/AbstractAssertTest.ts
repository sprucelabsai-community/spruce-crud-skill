import crudAssert from '../../../assertions/crudAssert'
import AbstractCrudTest from '../../support/AbstractCrudTest'

export default abstract class AbstractAssertTest extends AbstractCrudTest {
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.runBeforeEach()
    }

    private static runBeforeEach() {
        crudAssert.beforeEach(this.views)
    }
}
