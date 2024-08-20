import {
    AbstractSkillViewController,
    ListRow,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
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
            crudAssert.masterSkillViewRendersList()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'id'],
        })
    }

    @test()
    protected static async throwsIfDoesNotRenderCard() {
        this.dropInMasterSkillView()
        await this.assertMasterSkillViewRendersListThrowsWhenListNotFound()
    }

    @test()
    protected static async passesIfRenderingCardById() {
        this.dropInMasterSkillView()
        await crudAssert.masterSkillViewRendersList(
            this.fakeSvc,
            this.firstEntityId
        )
    }

    @test()
    protected static async throwsIfFirstConfigDoesNotMatch() {
        this.dropInMasterSkillView()
        await this.assertMasterListRendersListThrows({
            load: {
                fqen: 'list-roles::v2020_12_25',
            },
        })
    }

    @test()
    protected static async passesIfFirstFqenMatches() {
        this.dropInMasterSkillView()
        await this.masterSkillViewRendersList({
            load: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    @test()
    protected static async throwsIfFqenDoesNotMatch() {
        this.dropInMasterSkillView([
            {
                id: 'test-1',
                title: generateId(),
                load: {
                    fqen: 'list-installed-skills::v2020_12_25',
                    responseKey: 'skills',
                    rowTransformer: () => ({}) as ListRow,
                },
            },
        ])

        await this.assertMasterListRendersListThrows({
            load: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    @test()
    protected static async throwsIfTitleDoesNotMatch() {
        this.dropInMasterSkillView()
        await this.assertMasterListRendersListThrows({
            title: generateId(),
            load: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    @test()
    protected static async throwsIfListCardRendersRowMissingRequired() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.masterListCardRendersRow()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'listCardId', 'rowId'],
        })
    }

    @test()
    protected static async listCardRendersRowThrowsIfRowNotRendering() {
        await assert.doesThrowAsync(
            () =>
                crudAssert.masterListCardRendersRow(
                    this.fakeSvc,
                    generateId(),
                    generateId()
                ),
            'is not rendering a list card'
        )
    }

    @test()
    protected static async listCardRendersRowThrowsIfListFoundButNotRow() {
        this.dropInMasterSkillView()
        await assert.doesThrowAsync(
            () =>
                crudAssert.masterListCardRendersRow(
                    this.fakeSvc,
                    this.firstEntityId,
                    generateId()
                ),
            `Can't find a row`
        )
    }

    @test()
    @seed('locations', 1)
    protected static async listCardRendersRowPassesIfRowFound() {
        this.dropInMasterSkillView()
        await crudAssert.masterListCardRendersRow(
            this.fakeSvc,
            this.firstEntityId,
            this.fakedLocations[0].id
        )
    }

    private static async assertMasterListRendersListThrows(
        options: ExpectedListEntityOptions
    ) {
        await assert.doesThrowAsync(() =>
            this.masterSkillViewRendersList(options)
        )
    }

    private static async masterSkillViewRendersList(
        expected: ExpectedListEntityOptions
    ) {
        await crudAssert.masterSkillViewRendersList(
            this.fakeSvc,
            this.firstEntityId,
            expected
        )
    }

    private static get firstEntityId(): string {
        return this.firstEntity.id!
    }

    private static get firstEntity() {
        assert.isTruthy(
            this.fakeSvc.entities,
            `You forgot to call this.dropInMasterSkillView()`
        )
        const entity = this.fakeSvc.entities![0]
        return entity
    }

    private static dropInMasterSkillView(
        entities?: MasterSkillViewListEntity[]
    ) {
        this.fakeSvc.dropInMasterSkillView(entities)
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

    private static async assertMasterSkillViewRendersListThrowsWhenListNotFound() {
        await assert.doesThrowAsync(
            () =>
                crudAssert.masterSkillViewRendersList(
                    this.fakeSvc,
                    generateId()
                ),
            'is not rendering a list card'
        )
    }
}

class FakeSkillView extends AbstractSkillViewController {
    private masterSkillView?: MasterSkillViewController
    public entities?: MasterSkillViewListEntity[]
    public dropInMasterSkillView(entities?: MasterSkillViewListEntity[]) {
        this.entities = (entities ?? [
            buildLocationTestEntity(),
        ]) as MasterSkillViewListEntity[]
        this.masterSkillView = this.Controller('crud.master-skill-view', {
            entities: this.entities as any,
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
