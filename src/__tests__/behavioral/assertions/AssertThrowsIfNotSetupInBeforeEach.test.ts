import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import crudAssert from '../../../assertions/crudAssert'
import AbstractCrudTest from '../../support/AbstractCrudTest'

@fake.login()
export default class AssertThrowsIfNotSetupInBeforeEachTest extends AbstractCrudTest {
    @test()
    protected static async rendersMasterThrowsWithoutBeforeEach() {
        assert.doesThrow(
            //@ts-ignore
            () => crudAssert.skillViewRendersMasterView(),
            'crudAssert.beforeEach'
        )
    }

    @test()
    protected static async loadsMasterThrowsWithoutBeforeEach() {
        await assert.doesThrowAsync(
            //@ts-ignore
            () => crudAssert.skillViewLoadsMasterView(),
            'crudAssert.beforeEach'
        )
    }

    @test()
    protected static async masterListCardRenderThrowsWithoutBeforeEach() {
        await assert.doesThrowAsync(
            //@ts-ignore
            () => crudAssert.masterListCardRendersRow(),
            'crudAssert.beforeEach'
        )
    }

    @test()
    protected static async assertListTargetAfterLoadThrowsWithoutBeforeEach() {
        await assert.doesThrowAsync(
            //@ts-ignore
            () => crudAssert.assertListsLoadTargetAfterMasterLoad(),
            'crudAssert.beforeEach'
        )
    }
}
