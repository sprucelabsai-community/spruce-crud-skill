import {
    AbstractSkillViewController,
    SkillView,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import crudAssert from '../../../assertions/crudAssert'
import MasterSkillViewController from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import { buildTestEntity } from '../../support/test.utils'

@fake.login()
export default class CrudAssertTest extends AbstractCrudTest {
    private static fakeSvc: FakeSkillView
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.views.setController('fake', FakeSkillView)
        this.fakeSvc = this.views.Controller('fake', {})
    }

    @test()
    protected static async throwsIfBeforeEachMissingRequired() {
        //@ts-ignore
        const err = assert.doesThrow(() => crudAssert.beforeEach())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['viewFixture'],
        })
    }

    @test()
    protected static async throwsIfNotSetupInBeforeEach() {
        assert.doesThrow(
            //@ts-ignore
            () => crudAssert.skillViewRendersMasterView(),
            'crudAssert.beforeEach'
        )
    }

    @test()
    protected static async throwsWithMissing() {
        this.runBeforeEach()

        const err = assert.doesThrow(() =>
            //@ts-ignore
            crudAssert.skillViewRendersMasterView()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView'],
        })
    }

    @test()
    protected static async throwsIfMasterSkillViewHasNotBeenSet() {
        this.runBeforeEach()
        this.assertMissingViewControllerThrowsAsExpected(
            'crud.master-skill-view',
            'MasterSkillViewController'
        )
    }

    @test()
    protected static async throwsIfMasterListCardHasNotBeenSet() {
        this.runBeforeEach()
        this.assertMissingViewControllerThrowsAsExpected(
            'crud.master-list-card',
            'MasterListCardViewController'
        )
    }

    @test()
    protected static async throwsIfNotRenderingAsMaster() {
        this.runBeforeEach()
        assert.doesThrow(
            () => this.assertRendersMasterSkillView(),
            'not rendering a MasterSkillViewController'
        )
    }

    @test()
    protected static async doesNotThrowIfActuallyRenderingMasterViewController() {
        this.runBeforeEach()
        this.fakeSvc.dropInMasterSkillView()
        this.assertRendersMasterSkillView()
    }

    private static assertMissingViewControllerThrowsAsExpected(
        id: string,
        className: string
    ) {
        this.views.getFactory().setController(id, undefined as any)
        this.assertRendersMasterViewThrows(id)
        this.assertRendersMasterViewThrows(className)
    }

    private static assertRendersMasterViewThrows(message: string) {
        assert.doesThrow(() => this.assertRendersMasterSkillView(), message)
    }

    private static runBeforeEach() {
        crudAssert.beforeEach(this.views)
    }

    private static assertRendersMasterSkillView() {
        crudAssert.skillViewRendersMasterView(this.fakeSvc)
    }
}

class FakeSkillView extends AbstractSkillViewController {
    private masterSkillView?: MasterSkillViewController
    public dropInMasterSkillView() {
        this.masterSkillView = this.Controller('crud.master-skill-view', {
            entities: [buildTestEntity()],
        })
    }
    public render(): SkillView {
        return (
            this.masterSkillView?.render() ?? {
                controller: this,
            }
        )
    }
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        fake: FakeSkillView
    }

    interface ViewControllerMap {
        fake: FakeSkillView
    }
}
