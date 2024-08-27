import {
    AbstractSkillViewController,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import CrudDetailSkillViewController, {
    CrudDetailSkillViewArgs,
    CrudDetailSkillViewEntity,
    DetailSkillViewControllerOptions,
} from '../../../detail/CrudDetailSkillViewController'
import { crudAssert } from '../../../index-module'
import { buildLocationTestDetailEntity as buildLocationDetailTestEntity } from '../../support/test.utils'
import AbstractAssertTest from './AbstractAssertTest'

@fake.login()
export default class CrudAssertingDetailViewTest extends AbstractAssertTest {
    private static vc: SkillViewWithDetailView
    private static entities: CrudDetailSkillViewEntity[]
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.entities = []
        this.views.setController('fake-with-detail', SkillViewWithDetailView)
        this.vc = this.views.Controller('fake-with-detail', {})
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
                'recordId',
                'listCardId',
                'expectedTarget',
            ],
        })
    }

    @test()
    @seed('locations', 1)
    protected static async throwsIfTargetDoesNotMatchLocationId() {
        await this.eventFaker.fakeGetLocation()
        this.dropInDetailSkillView()
        await this.assertLoadTargetDoesNotMatch({
            locationId: generateId(),
        })
    }

    @test()
    @seed('organizations', 1)
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
    @seed('locations', 1)
    protected static async loadTargetMatchesExpectedForLocationId() {
        const entity = buildLocationDetailTestEntity()

        entity.load.buildTarget = async (recordId) => {
            return { locationId: recordId }
        }

        this.dropInDetailSkillView({
            entities: [{ ...entity }],
        })

        await this.assertDetailLoadTargetEquals({
            recordId: this.fakedLocations[0].id,
            expectedTarget: {
                locationId: this.fakedLocations[0].id,
            },
        })
    }

    @test()
    @seed('organizations', 1)
    protected static async loadtargetMatchesExpectedForOrganizationId() {
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

    private static assertRendersDetailFewThrowsForMissmatchedOptions(
        options: Partial<DetailSkillViewControllerOptions>
    ) {
        assert.doesThrow(
            () => this.assertRendersDetailView(options),
            'Expected'
        )
    }

    private static async assertDetailLoadTargetEquals(options: {
        recordId: string
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

    private static dropInDetailSkillView(
        options?: Partial<DetailSkillViewControllerOptions>
    ) {
        const { entities, ...rest } = options ?? {}
        this.entities = entities ?? [buildLocationDetailTestEntity()]
        this.vc.dropInDetailSkillView({
            cancelDestination: 'crud.root',
            entities: this.entities,
            ...rest,
        })
    }

    private static assertRendersDetailThrowsWithMissingView(
        id: string,
        className: string
    ) {
        this.views.setController(id as any, undefined as any)
        assert.doesThrow(() => this.assertRendersDetailView(), className)
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
