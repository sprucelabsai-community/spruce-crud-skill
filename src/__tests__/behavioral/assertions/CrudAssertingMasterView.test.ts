import {
    AbstractSkillViewController,
    ListRow,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import crudAssert, {
    ExpectedListEntityOptions,
} from '../../../assertions/crudAssert'
import CrudMasterSkillViewController, {
    CrudMasterSkillViewControllerOptions,
    CrudListEntity,
} from '../../../master/CrudMasterSkillViewController'
import {
    buildLocationListEntity,
    buildLocationListPagingEntity,
} from '../../support/test.utils'
import AbstractAssertTest from './AbstractAssertTest'

@fake.login()
export default class CrudAssertingMasterViewTest extends AbstractAssertTest {
    private static fakeSvc: SkillViewWithMasterView
    private static clickRowDestination?: SkillViewControllerId
    private static addDestination?: SkillViewControllerId
    private static currentSkillViewId: SkillViewControllerId

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        delete this.clickRowDestination
        delete this.addDestination
        this.currentSkillViewId = generateId() as SkillViewControllerId
        this.views.setController('fake-with-master', SkillViewWithMasterView)
        this.fakeSvc = this.views.Controller('fake-with-master', {
            currentSkillViewId: this.currentSkillViewId,
        })
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
            'crud.list-card',
            'CrudListCardViewController'
        )
    }

    @test()
    protected static async throwsIfNotRenderingAsMaster() {
        assert.doesThrow(
            () => this.assertRendersMasterSkillView(),
            'not rendering a CrudMasterSkillViewController'
        )
    }

    @test()
    protected static async throwsIfClickDestinationDoesNotMatch() {
        const destination = 'crud.root'
        this.dropInMasterWithClickDestination(destination)
        this.assertMasterOptionsDoNotMatch({
            clickRowDestination: 'crud.master-skill-view',
        })
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
    protected static async throwsIfAddDestinationDoesNotMatch() {
        this.dropinMasterWithAddDestination('crud.root')
        this.assertMasterOptionsDoNotMatch({
            addDestination: 'crud.master-skill-view',
        })
    }

    @test('passes if add destination matches crude.root', 'crud.root')
    @test(
        'passes if add destination matches crud.master-skill-view',
        'crud.master-skill-view'
    )
    protected static async passesIfAddDestinationMatches(
        destination: SkillViewControllerId
    ) {
        this.dropinMasterWithAddDestination(destination)
        this.assertRendersMasterSkillView({
            addDestination: destination,
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
            list: {
                fqen: 'list-roles::v2020_12_25',
            },
        })
    }

    @test()
    protected static async passesIfFirstFqenMatches() {
        this.dropInMasterSkillView()
        await this.masterSkillViewRendersList({
            list: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    @test()
    protected static async throwsIfFqenDoesNotMatch() {
        this.dropInMasterSkillView([
            {
                id: 'test-1',
                pluralTitle: generateId(),
                singularTitle: generateId(),
                list: {
                    fqen: 'list-installed-skills::v2020_12_25',
                    responseKey: 'skills',
                    rowTransformer: () => ({}) as ListRow,
                },
            },
        ])

        await this.assertMasterListRendersListThrows({
            list: {
                fqen: 'list-locations::v2020_12_25',
            },
        })
    }

    @test()
    protected static async throwsIfTitleDoesNotMatch() {
        this.dropInMasterSkillView()
        await this.assertMasterListRendersListThrows({
            pluralTitle: generateId(),
            list: {
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
            parameters: ['skillView', 'entityId', 'rowId'],
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
            crudAssert.masterListLoadsWithTarget()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'entityId', 'expectedTarget'],
        })
    }

    @test()
    protected static async targetAfterLoadThrowsIfDoesNotMatchExpected() {
        await assert.doesThrowAsync(
            () =>
                //@ts-ignore
                crudAssert.masterListLoadsWithTarget(),
            'target'
        )
    }

    @test()
    protected static async passesIfTargetMatchesOnFirstList() {
        const id = generateId()
        const entity = this.buildLocationListEntity(id)
        this.dropInMasterSkillView([entity])

        const target = { organizationId: generateId() }

        this.fakeSvc.onWillLoad = () => {
            this.fakeSvc.setTarget(id, target)
        }

        await crudAssert.masterListLoadsWithTarget(this.fakeSvc, id, target)
    }

    @test()
    @seed('locations', 10)
    protected static async canAssertIfListRendersRowWithPaging() {
        const entity = buildLocationListPagingEntity()
        this.dropInMasterSkillView([entity])
        await crudAssert.masterListCardRendersRow(
            this.fakeSvc,
            this.firstEntityId,
            this.fakedLocations[0].id
        )
    }

    @test()
    protected static async assertAddArgsThrowsIfMissingRequired() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.addDestinationArgsEqual()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'entityId', 'expectedArgs'],
        })
    }

    @test()
    protected static async assertAddArgsThrowsIfListNotFound() {
        this.dropInMasterSkillView()
        await assert.doesThrowAsync(
            () =>
                //@ts-ignore
                crudAssert.addDestinationArgsEqual(
                    this.fakeSvc,
                    generateId(),
                    {}
                ),
            'not rendering a list'
        )
    }

    @test('throws if add args do not match 1', { action: 'create' })
    @test('throws if add args do not match 2', { foo: 'bar' })
    protected static async throwsIfAddArgsDoNotMatch(
        args: Record<string, any>
    ) {
        this.dropInMasterSkillView()
        await this.assertAddDestinationArgsEqualThrows(args)
    }

    @test('passes if add destination args match 1', { foo: 'bar' })
    @test('passes if add destination args match 2', { bar: 'baz' })
    protected static async passesIfAddDestinationArgsMatch(
        args: Record<string, any>
    ) {
        this.dropInMasterSkillViewAndSetAddArgs(args)

        await crudAssert.addDestinationArgsEqual(
            this.fakeSvc,
            this.firstEntityId,
            args
        )
    }

    @test()
    protected static async assertAddDestinationArgsThrowIfHasMoreSetThanExpected() {
        this.dropInMasterSkillViewAndSetAddArgs({
            foo: 'bar',
            bar: 'baz',
        })

        await this.assertAddDestinationArgsEqualThrows({
            foo: 'bar',
        })
    }

    private static async assertAddDestinationArgsEqualThrows(
        args: Record<string, any>
    ) {
        await assert.doesThrowAsync(
            () =>
                crudAssert.addDestinationArgsEqual(
                    this.fakeSvc,
                    this.firstEntityId,
                    args
                ),
            'args'
        )
    }

    private static dropInMasterSkillViewAndSetAddArgs(
        args: Record<string, any>
    ) {
        this.dropInMasterSkillView()
        this.setAddDestinationArgs(args)
    }

    private static setAddDestinationArgs(args: Record<string, any>) {
        this.fakeSvc.setAddDestinationArgsOnLoad(this.firstEntityId, args)
    }

    private static dropInMasterWithClickDestination(
        destination: SkillViewControllerId
    ) {
        this.clickRowDestination = destination
        this.dropInMasterSkillView()
    }

    private static assertMasterOptionsDoNotMatch(
        expected: Partial<CrudMasterSkillViewControllerOptions>
    ) {
        assert.doesThrow(
            () => this.assertRendersMasterSkillView(expected),
            'Expected'
        )
    }

    private static dropinMasterWithAddDestination(
        destination: SkillViewControllerId
    ) {
        this.addDestination = destination
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
        entities?: CrudListEntity<any, any>[]
    ) {
        this.fakeSvc.dropInMasterSkillView({
            entities,
            addDestination: this.addDestination,
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
        expectedOptions?: Partial<CrudMasterSkillViewControllerOptions>
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
    private masterSkillView?: CrudMasterSkillViewController
    public entities?: CrudListEntity[]
    public onWillLoad?: () => void
    private argsToSetOnLoad: { listId: string; args: Record<string, any> }[] =
        []
    public currentSkillViewId: SkillViewControllerId

    public constructor(options: ViewControllerOptions & SkillViewOptions) {
        super(options)
        const { currentSkillViewId } = assertOptions(options, [
            'currentSkillViewId',
        ])
        this.currentSkillViewId = currentSkillViewId
    }

    public dropInMasterSkillView(
        options: Partial<CrudMasterSkillViewControllerOptions>
    ) {
        const { entities } = options ?? {}
        this.entities = (entities ?? [
            buildLocationListEntity(),
        ]) as CrudListEntity[]

        this.masterSkillView = this.Controller('crud.master-skill-view', {
            ...options,
            currentSkillViewId: this.currentSkillViewId,
            entities: this.entities as any,
        })
    }

    public setAddDestinationArgsOnLoad(
        listId: string,
        args: Record<string, any>
    ) {
        this.argsToSetOnLoad.push({
            listId,
            args,
        })
    }

    public async load(options: SkillViewControllerLoadOptions) {
        this.onWillLoad?.()

        for (const { listId, args } of this.argsToSetOnLoad) {
            this.masterSkillView?.setAddDestinationArgs(listId, args)
        }

        await this.masterSkillView?.load(options)
    }

    public setTarget(id: string, target?: Record<string, any>) {
        this.masterSkillView?.setListTarget(id, target)
    }

    public render(): SkillView {
        return (
            this.masterSkillView?.render() ?? {
                controller: this,
            }
        )
    }
}

interface SkillViewOptions {
    currentSkillViewId?: SkillViewControllerId
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'fake-with-master': SkillViewWithMasterView
    }

    interface ViewControllerMap {
        'fake-with-master': SkillViewWithMasterView
    }

    interface ViewControllerOptionsMap {
        'fake-with-master': SkillViewOptions
    }
}
