import {
    AbstractSkillViewController,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { SkillEventContract } from '@sprucelabs/mercury-types'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import {
    test,
    assert,
    errorAssert,
    generateId,
    RecursivePartial,
} from '@sprucelabs/test-utils'
import CrudDetailSkillViewController, {
    CrudDetailSkillViewArgs,
    CrudDetailSkillViewEntity,
    DetailSkillViewControllerOptions,
} from '../../../detail/CrudDetailSkillViewController'
import { crudAssert, CrudListEntity } from '../../../index-module'
import { buildLocationDetailEntity as buildLocationDetailTestEntity } from '../../support/test.utils'
import AbstractAssertTest from './AbstractAssertTest'

@fake.login()
export default class CrudAssertingDetailViewTest extends AbstractAssertTest {
    private static vc: SkillViewWithDetailView
    private static entities: CrudDetailSkillViewEntity[]
    private static recordId?: string

    @seed('locations', 1)
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.entities = []
        this.views.setController('fake-with-detail', SkillViewWithDetailView)
        this.vc = this.views.Controller('fake-with-detail', {})
        this.recordId = this.fakedLocations[0].id
    }

    @test()
    protected static async rendersDetailViewThrowsWithMissing() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            crudAssert.skillViewRendersDetailView()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView'],
        })
    }

    @test()
    protected static async throwsIfDetailViewNotSetInFactory() {
        this.assertRendersDetailThrowsWithMissingView(
            'crud.detail-skill-view',
            'DetailSkillViewController'
        )
    }

    @test()
    protected static async throwsIfDetailFormNetSetInFactory() {
        this.assertRendersDetailThrowsWithMissingView(
            'crud.detail-form-card',
            'DetailFormCardViewController'
        )
    }

    @test()
    protected static async throwsIfSkillViewIsNotRenderingDetailView() {
        assert.doesThrow(
            () => crudAssert.skillViewRendersDetailView(this.vc),
            'not rendering'
        )
    }

    @test()
    protected static async assertSkillViewRenderingDetailView() {
        this.dropInDetailSkillView()
        this.assertRendersDetailView()
    }

    @test()
    protected static async assertSkillViewRendersDetailThrowsWithMissmatchCancelDestination() {
        this.dropInDetailSkillView()
        this.assertRendersDetailFewThrowsForMissmatchedOptions({
            cancelDestination: `crud.master-skill-view`,
        })
    }

    @test('asserts matches cancel destination crud.root', 'crud.root')
    @test(
        'asserts matches cancel destination crud.master-skill-view',
        'crud.master-skill-view'
    )
    protected static async assertMatchesCancelDestination(
        id: SkillViewControllerId
    ) {
        this.dropInDetailSkillView({ cancelDestination: id })
        this.assertRendersDetailView({
            cancelDestination: id,
        })
    }

    @test()
    protected static async throwsIfEntitiesDontMatch() {
        this.dropInDetailSkillView()
        this.assertRendersDetailFewThrowsForMissmatchedOptions({
            entities: [buildLocationDetailTestEntity()],
        })
    }

    @test()
    protected static async passesIfEntitiesMatch() {
        const entities = [
            buildLocationDetailTestEntity(),
            buildLocationDetailTestEntity(),
        ]
        this.dropInDetailSkillView({ entities })
        this.assertRendersDetailView({ entities })
    }

    @test()
    protected static async detailIsLoadedThrowsWithMissing() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.skillViewLoadsDetailView()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView'],
        })
    }

    @test()
    protected static async detailThrowsIfNotLoaded() {
        this.dropInDetailSkillView()
        this.vc.shouldLoad = false
        await assert.doesThrowAsync(
            () => crudAssert.skillViewLoadsDetailView(this.vc),
            'not loading'
        )
    }

    @test()
    protected static async throwsIfLoadDoesNotTriggerRender() {
        this.dropInDetailSkillView()
        this.vc.shouldTriggerRenderOnLoad = false
        await assert.doesThrowAsync(
            () => crudAssert.skillViewLoadsDetailView(this.vc),
            'triggerRender'
        )
    }

    @test()
    protected static async passesWhenLoadedOnLoad() {
        this.dropInDetailSkillView()
        await crudAssert.skillViewLoadsDetailView(this.vc)
    }

    @test()
    protected static async assertLoadTargetThrowsWithMissing() {
        this.dropInDetailSkillView()
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.detailLoadTargetEquals()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: [
                'skillView',
                'listCardId',
                'recordId',
                'expectedTarget',
            ],
        })
    }

    @test()
    protected static async throwsIfTargetDoesNotMatchLocationId() {
        await this.eventFaker.fakeGetLocation()
        this.dropInDetailSkillView()
        await this.assertLoadTargetDoesNotMatch({
            locationId: generateId(),
        })
    }

    @test()
    protected static async throwsIfTargetDoesNotMatchOrganizationId() {
        await this.eventFaker.fakeGetOrganization()
        const entity = buildLocationDetailTestEntity()
        entity.load = {
            buildTarget: async () => {
                return { organizationId: generateId() }
            },
            fqen: 'get-organization::v2020_12_25',
            responseKey: 'organization',
        }

        this.dropInDetailSkillView({
            entities: [entity],
        })

        await this.assertLoadTargetDoesNotMatch({
            organizationId: generateId(),
        })
    }

    @test()
    protected static async loadTargetMatchesExpectedForLocationId() {
        const entity = buildLocationDetailTestEntity()

        entity.load.buildTarget = async (recordId) => {
            return { locationId: recordId }
        }

        this.dropInDetailSkillView({
            entities: [{ ...entity }],
        })

        await this.assertDetailLoadTargetEquals({
            recordId: this.locationId,
            expectedTarget: {
                locationId: this.locationId,
            },
        })
    }

    @test()
    protected static async loadTargetMatchesExpectedForOrganizationId() {
        const entity = buildLocationDetailTestEntity()

        entity.load = {
            buildTarget: async (recordId) => {
                return { organizationId: recordId }
            },
            fqen: 'get-organization::v2020_12_25',
            responseKey: 'organization',
        }

        this.dropInDetailSkillView({
            entities: [{ ...entity }],
        })

        const recordId = this.fakedOrganizations[0].id
        const expectedTarget = {
            organizationId: this.fakedOrganizations[0].id,
        }

        await this.assertDetailLoadTargetEquals({ recordId, expectedTarget })
    }

    @test()
    protected static async assertRendersRelatedEntityThrowsWithMissing() {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            crudAssert.detailRendersRelatedEntity()
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['skillView', 'entityId', 'relatedId'],
        })
    }

    @test()
    protected static async assertRendersRelatedThrowsIfNoEntityId() {
        this.dropInDetailSkillView()

        await assert.doesThrowAsync(
            () =>
                crudAssert.detailRendersRelatedEntity({
                    skillView: this.vc,
                    entityId: generateId(),
                    recordId: this.locationId,
                    relatedId: generateId(),
                }),
            'entityId'
        )
    }

    @test()
    protected static async assertRendersRelatedThrowsIfNoRelatedExists() {
        this.dropInDetailViewWithLocationAndOneRelated()

        await assert.doesThrowAsync(
            () =>
                crudAssert.detailRendersRelatedEntity({
                    skillView: this.vc,
                    entityId: this.firstEntityId,
                    recordId: this.locationId,
                    relatedId: generateId(),
                }),
            'related entity'
        )
    }

    @test()
    protected static async passesIfRelatedEntityExists() {
        this.dropInDetailViewWithLocationAndOneRelated()
        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId)
    }

    @test()
    protected static async canFindSecondRelatedEntity() {
        const entity = this.buildLocationDetailEntity()

        entity.relatedEntities = [
            this.buildLocationListEntity(),
            this.buildLocationListEntity(),
        ]

        this.dropInDetailSkillView({
            entities: [entity],
        })

        await this.assertRelatedExistsInFirstEntity(
            this.entities[0].relatedEntities![1].id
        )
    }

    @test()
    protected static async throwsIfRelatedEntitiesOptionsDontMatch() {
        this.dropInDetailViewWithLocationAndOneRelated()
        const expected = {
            pluralTitle: generateId(),
        }
        await this.assertThrowsWhenFirstRelatedOptionsDontMatch(expected)
    }

    @test()
    protected static async passesIfRelatedEntityPluralTitleMatches() {
        this.dropInDetailViewWithLocationAndOneRelated()
        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            pluralTitle: this.firstRelatedEntity.pluralTitle,
        })
    }

    @test()
    protected static async passesIfRelatedEntitySingularTitleMatches() {
        this.dropInDetailViewWithLocationAndOneRelated()
        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            singularTitle: this.firstRelatedEntity.singularTitle,
        })
    }

    @test()
    protected static async matchesRelatedTargetAfterLoad() {
        const target = { organizationId: generateId() }

        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target)

        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            list: {
                target: target as any,
            },
        })
    }

    @test()
    protected static async throwsIfBuiltTargetDoesNotMatch() {
        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget({
            organizationId: generateId(),
        })

        await this.assertThrowsWhenFirstRelatedOptionsDontMatch({
            list: {
                target: { organizationId: generateId() } as any,
            },
        })
    }

    @test()
    protected static async relatedOptionsCanStillFailEvenIfBuiltTargetMatches() {
        const target = { organizationId: generateId() }
        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target)
        await this.assertThrowsWhenFirstRelatedOptionsDontMatch({
            pluralTitle: generateId(),
            list: {
                target: target as any,
            },
        })
    }

    @test()
    protected static async relatedOptionsCanThrowIfAnotherListPropertyDoesNotMatch() {
        const target = { organizationId: generateId() }
        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target)
        await this.assertThrowsWhenFirstRelatedOptionsDontMatch({
            list: {
                target: target as any,
                paging: {
                    pageSize: 0,
                },
            },
        })
    }

    @test()
    protected static async assertingRelatedOptionsWithBuildTargetPassWithoutTargetInExpected() {
        const target = { organizationId: generateId() }
        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target)
        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            pluralTitle: this.firstRelatedEntity.pluralTitle,
        })
    }

    @test()
    protected static async passesLoadedEntityToBuildTarget() {
        this.dropInDetailViewWithLocationAndOneRelated()
        let passedValues: Record<string, any> | undefined
        const target = { organizationId: generateId() }

        this.firstRelatedEntity.list.buildTarget = (values) => {
            passedValues = values
            return target
        }

        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            list: { target: target as any },
        })

        assert.isEqualDeep(passedValues, this.fakedLocations[0])
    }

    @test()
    protected static async canMatchOnTargetWithoutRecordId() {
        const target = { organizationId: generateId() }

        this.dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target)
        this.firstRelatedEntity.list.buildTarget = (values) => {
            assert.isFalsy(values)
            return target
        }

        delete this.recordId

        await this.assertRelatedExistsInFirstEntity(this.firstRelatedEntityId, {
            list: {
                target: target as any,
            },
        })
    }

    private static dropInDetailViewWithLocationAndSetFirstRelatedBuiltTarget(target: {
        organizationId: string
    }) {
        this.dropInDetailViewWithLocationAndOneRelated()
        this.setFirstRelatedBuiltTarget(target)
    }

    private static async assertThrowsWhenFirstRelatedOptionsDontMatch(
        expected: RecursivePartial<CrudListEntity<SkillEventContract>>
    ) {
        await assert.doesThrowAsync(
            () =>
                this.assertRelatedExistsInFirstEntity(
                    this.firstRelatedEntityId,
                    expected
                ),
            /expected/i
        )
    }

    private static setFirstRelatedBuiltTarget(target: {
        organizationId: string
    }) {
        this.firstRelatedEntity.list.buildTarget = () => {
            return target
        }
    }

    private static get firstRelatedEntityId(): string {
        return this.firstRelatedEntity.id
    }

    private static get firstRelatedEntity() {
        return this.entities[0].relatedEntities![0]
    }

    private static async assertRelatedExistsInFirstEntity(
        related: string,
        expectedOptions?: RecursivePartial<CrudListEntity<SkillEventContract>>
    ) {
        await crudAssert.detailRendersRelatedEntity({
            skillView: this.vc,
            entityId: this.firstEntityId,
            relatedId: related,
            recordId: this.recordId,
            expectedOptions,
        })
    }

    private static dropInDetailViewWithLocationAndOneRelated() {
        const entity = this.buildLocationDetailEntity()
        const relatedEntity = this.buildLocationListEntity()
        entity.relatedEntities = [relatedEntity]

        this.dropInDetailSkillView({
            entities: [entity],
        })
    }

    private static assertRendersDetailFewThrowsForMissmatchedOptions(
        options: Partial<DetailSkillViewControllerOptions>
    ) {
        assert.doesThrow(
            () => this.assertRendersDetailView(options),
            'Expected'
        )
    }

    private static async assertDetailLoadTargetEquals(options: {
        recordId?: string
        expectedTarget: Record<string, any>
        listCardId?: string
    }) {
        const { recordId, expectedTarget, listCardId } = options
        await crudAssert.detailLoadTargetEquals({
            skillView: this.vc,
            recordId,
            expectedTarget,
            listCardId: listCardId ?? this.entities[0].id,
        })
    }

    private static async assertLoadTargetDoesNotMatch(
        expectedTarget: Record<string, any>
    ) {
        await assert.doesThrowAsync(
            () =>
                this.assertDetailLoadTargetEquals({
                    recordId: generateId(),
                    expectedTarget,
                }),
            'target does not match'
        )
    }

    private static assertRendersDetailView(
        options?: Partial<DetailSkillViewControllerOptions>
    ): any {
        return crudAssert.skillViewRendersDetailView(this.vc, options)
    }

    private static get firstEntityId(): string {
        return this.entities[0].id
    }

    private static dropInDetailSkillView(
        options?: Partial<DetailSkillViewControllerOptions>
    ) {
        const { entities, ...rest } = options ?? {}
        this.entities = entities ?? [this.buildLocationDetailEntity()]
        this.vc.dropInDetailSkillView({
            cancelDestination: 'crud.root',
            entities: this.entities,
            ...rest,
        })
    }

    private static buildLocationDetailEntity(): CrudDetailSkillViewEntity {
        return buildLocationDetailTestEntity()
    }

    private static assertRendersDetailThrowsWithMissingView(
        id: string,
        className: string
    ) {
        this.views.setController(id as any, undefined as any)
        assert.doesThrow(() => this.assertRendersDetailView(), className)
    }

    private static get locationId() {
        return this.fakedLocations[0].id
    }
}

class SkillViewWithDetailView extends AbstractSkillViewController {
    private detailSkillView?: CrudDetailSkillViewController
    public shouldLoad = true
    public shouldTriggerRenderOnLoad = true

    public dropInDetailSkillView(options: DetailSkillViewControllerOptions) {
        this.detailSkillView = this.Controller(
            'crud.detail-skill-view',
            options
        )
    }

    public async load(
        options: SkillViewControllerLoadOptions<CrudDetailSkillViewArgs>
    ) {
        if (this.shouldLoad) {
            await this.detailSkillView?.load(options)
            if (this.shouldTriggerRenderOnLoad) {
                this.triggerRender()
            }
        }
    }

    public render(): SkillView {
        return (
            this.detailSkillView?.render() ?? {
                controller: this,
            }
        )
    }
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'fake-with-detail': SkillViewWithDetailView
    }

    interface ViewControllerMap {
        'fake-with-detail': SkillViewWithDetailView
    }
}
