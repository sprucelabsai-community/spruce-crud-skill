import {
    AbstractSkillViewController,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import CrudDetailSkillViewController, {
    CrudDetailSkillViewArgs,
    DetailSkillViewControllerOptions,
} from '../../../detail/CrudDetailSkillViewController'
import { crudAssert } from '../../../index-module'
import { buildTestDetailEntity } from '../../support/test.utils'
import AbstractAssertTest from './AbstractAssertTest'

@fake.login()
export default class CrudAssertingDetailViewTest extends AbstractAssertTest {
    private static vc: SkillViewWithDetailView
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

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
            entities: [buildTestDetailEntity()],
        })
    }

    @test()
    protected static async passesIfEntitiesMatch() {
        const entities = [buildTestDetailEntity(), buildTestDetailEntity()]
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
    protected static async passesWhenLoadedOnLoad() {
        this.dropInDetailSkillView()
        await crudAssert.skillViewLoadsDetailView(this.vc)
    }

    private static assertRendersDetailFewThrowsForMissmatchedOptions(
        options: Partial<DetailSkillViewControllerOptions>
    ) {
        assert.doesThrow(
            () => this.assertRendersDetailView(options),
            'Expected'
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
        this.vc.dropInDetailSkillView({
            cancelDestination: 'crud.root',
            entities: [buildTestDetailEntity()],
            ...options,
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
