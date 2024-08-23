import {
    AbstractSkillViewController,
    ListRow,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import crudAssert, {
    ExpectedListEntityOptions,
} from '../../../assertions/crudAssert'
import MasterSkillViewController, {
    MasterSkillViewControllerOptions,
    MasterSkillViewListEntity,
} from '../../../master/MasterSkillViewController'
import {
    buildLocationTestEntity,
    buildLocationTestPagingEntity,
} from '../../support/test.utils'
import AbstractAssertTest from './AbstractAssertTest'

@fake.login()
export default class CrudAssertingMasterViewTest extends AbstractAssertTest {
    private static fakeSvc: SkillViewWithMasterView
    private static clickRowDestination?: SkillViewControllerId

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        delete this.clickRowDestination
        this.views.setController('fake-with-master', SkillViewWithMasterView)
        this.fakeSvc = this.views.Controller('fake-with-master', {})
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
    protected static async rendersMasterViewThrowsWithMissing() {
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
        this.assertMissingViewControllerThrowsAsExpected(
            'crud.master-skill-view',
            'MasterSkillViewController'
        )
    }

    @test()
    protected static async throwsIfMasterListCardHasNotBeenSet() {
        this.assertMissingViewControllerThrowsAsExpected(
            'crud.master-list-card',
            'MasterListCardViewController'
        )
    }

    @test()
    protected static async throwsIfNotRenderingAsMaster() {
        assert.doesThrow(
            () => this.assertRendersMasterSkillView(),
            'not rendering a MasterSkillViewController'
        )
    }

    @test()
    protected static async throwsIfClickDestinationDoesNotMatch() {
        const destination = 'crud.root'
        this.dropInMasterWithClickDestination(destination)
        assert.doesThrow(
            () =>
                this.assertRendersMasterSkillView({
                    clickRowDestination: 'crud.master-skill-view',
                }),
            'options'
        )
    }

    @test(
        'passes if click destination is crud.master-skill-view',
        'crud.master-skill-view'
    )
    @test('passes if click destination is crud.root', 'crud.root')
    protected static async passesIfClickDestinationMatches(
        destination: SkillViewControllerId
    ) {
        this.dropInMasterWithClickDestination(destination)
        this.assertRendersMasterSkillView({
            clickRowDestination: destination,
        })
    }

    @test()
    protected static async doesNotThrowIfActuallyRenderingMasterViewController() {
        this.dropInMasterSkillView()
        this.assertRendersMasterSkillView()
    }

    @test()
    protected static async passesIfEmptyExpectedOptionsPassed() {
        this.clickRowDestination = 'crud.root'
        this.dropInMasterSkillView()
        this.assertRendersMasterSkillView({})
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
            `renders row`
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

    @test()
    protected static async assertTargetAfterLoadThrowsIfMissingRequired() {
        this.dropInMasterSkillView()
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.assertListsLoadTargetAfterMasterLoad()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'listCardId', 'expectedTarget'],
        })
    }

    @test()
    protected static async targetAfterLoadThrowsIfDoesNotMatchExpected() {
        await assert.doesThrowAsync(
            () =>
                //@ts-ignore
                crudAssert.assertListsLoadTargetAfterMasterLoad(),
            'target'
        )
    }

    @test()
    protected static async passesIfTargetMatchesOnFirstList() {
        const id = generateId()
        const entity = this.buildLocationTestEntity(id)
        this.dropInMasterSkillView([entity])

        const target = { organizationId: generateId() }

        this.fakeSvc.onWillLoad = () => {
            this.fakeSvc.setTarget(id, target)
        }

        await crudAssert.assertListsLoadTargetAfterMasterLoad(
            this.fakeSvc,
            id,
            target
        )
    }

    @test()
    @seed('locations', 10)
    protected static async canAssertIfListRendersRowWithPaging() {
        const entity = buildLocationTestPagingEntity()
        this.dropInMasterSkillView([entity])
        await crudAssert.masterListCardRendersRow(
            this.fakeSvc,
            this.firstEntityId,
            this.fakedLocations[0].id
        )
    }

    private static dropInMasterWithClickDestination(
        destination: SkillViewControllerId
    ) {
        this.clickRowDestination = destination
        this.dropInMasterSkillView()
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
        entities?: MasterSkillViewListEntity<any, any>[]
    ) {
        this.fakeSvc.dropInMasterSkillView({
            entities,
            clickRowDestination: this.clickRowDestination,
        })
    }

    private static assertMissingViewControllerThrowsAsExpected(
        id: string,
        className: string
    ) {
        this.views.setController(id as any, undefined as any)
        this.assertRendersMasterViewThrows(id)
        this.assertRendersMasterViewThrows(className)
    }

    private static assertRendersMasterViewThrows(message: string) {
        assert.doesThrow(() => this.assertRendersMasterSkillView(), message)
    }

    private static assertRendersMasterSkillView(
        expectedOptions?: Partial<MasterSkillViewControllerOptions>
    ) {
        crudAssert.skillViewRendersMasterView(this.fakeSvc, expectedOptions)
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

class SkillViewWithMasterView extends AbstractSkillViewController {
    private masterSkillView?: MasterSkillViewController
    public entities?: MasterSkillViewListEntity[]
    public onWillLoad?: () => void

    public dropInMasterSkillView(
        options: Partial<MasterSkillViewControllerOptions>
    ) {
        const { entities } = options ?? {}
        this.entities = (entities ?? [
            buildLocationTestEntity(),
        ]) as MasterSkillViewListEntity[]
        this.masterSkillView = this.Controller('crud.master-skill-view', {
            ...options,
            entities: this.entities as any,
        })
    }

    public async load(options: SkillViewControllerLoadOptions) {
        this.onWillLoad?.()
        await this.masterSkillView?.load(options)
    }

    public setTarget(id: string, target?: Record<string, any>) {
        this.masterSkillView?.setTarget(id, target)
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
        'fake-with-master': SkillViewWithMasterView
    }

    interface ViewControllerMap {
        'fake-with-master': SkillViewWithMasterView
    }
}
