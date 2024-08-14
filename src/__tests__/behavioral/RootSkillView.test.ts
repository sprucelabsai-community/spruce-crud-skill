import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test } from '@sprucelabs/test-utils'
import AbstractCrudTest from '../support/AbstractCrudTest'

@fake.login()
export default class RootSkillViewTest extends AbstractCrudTest {
    @test()
    protected static async rendersMaster() {}
}
