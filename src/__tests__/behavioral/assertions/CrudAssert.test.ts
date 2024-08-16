import {
    AbstractSkillViewController,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import crudAssert, {
    ExpectedListEntityOptions,
} from '../../../assertions/crudAssert'
import MasterSkillViewController, {
    MasterSkillViewListEntity,
} from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import { buildLocationTestEntity } from '../../support/test.utils'

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
        this.dropInMasterSkillView()
        this.assertRendersMasterSkillView()
    }

    @test()
    protected static async loadsTheMasterViewOnLoadThrowsWithMissing() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.skillViewLoadsMasterView()
        )
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView'],
        })
    }

    @test()
    protected static async throwsWhenMasterNotLoaded() {
        await assert.doesThrowAsync(
            () => crudAssert.skillViewLoadsMasterView(this.fakeSvc),
            'not loading'
        )
    }

    @test()
    protected static async passesWhenLoadsMaster() {
        this.dropInMasterSkillView()
        await crudAssert.skillViewLoadsMasterView(this.fakeSvc)
    }

    @test()
    protected static async assertingConfigurationThrowsWithMissing() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.assertMasterSkillViewRendersList()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'id'],
        })
    }

    @test()
    protected static async throwsIfDoesNotRenderCard() {
        this.dropInMasterSkillView()
        await assert.doesThrowAsync(
            () =>
                crudAssert.assertMasterSkillViewRendersList(
                    this.fakeSvc,
                    generateId()
                ),
            'is not rendering a list card'
        )
    }

    @test()
    protected static async passesIfRenderingCardById() {
        this.dropInMasterSkillView()
        await crudAssert.assertMasterSkillViewRendersList(
            this.fakeSvc,
            this.firstEntityId
        )
    }

    @test()
    protected static async throwsIfConfigDoesNotMatch() {
        this.dropInMasterSkillView()
        await assert.doesThrowAsync(() =>
            this.assertMasterSkillviewRendersList({
                load: {
                    fqen: 'list-roles::v2020_12_25',
                },
            })
        )
    }

    @test()
    protected static async passesIfFqenMatches() {
        this.dropInMasterSkillView()
        await this.assertMasterSkillviewRendersList({
            load: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    private static async assertMasterSkillviewRendersList(
        expected: ExpectedListEntityOptions
    ) {
        await crudAssert.assertMasterSkillViewRendersList(
            this.fakeSvc,
            this.firstEntityId,
            expected
        )
    }

    private static get firstEntityId(): string {
        return this.firstEntity.id!
    }

    private static get firstEntity() {
        return this.fakeSvc.entities![0]
    }

    private static dropInMasterSkillView() {
        this.fakeSvc.dropInMasterSkillView()
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
    public entities?: MasterSkillViewListEntity[]
    public dropInMasterSkillView() {
        this.entities = [buildLocationTestEntity()]
        this.masterSkillView = this.Controller('crud.master-skill-view', {
            entities: this.entities,
        })
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await this.masterSkillView?.load(options)
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
