import {
    AbstractSkillViewController,
    SkillView,
    SkillViewControllerId,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import DetailSkillViewController, {
    DetailSkillViewControllerOptions,
} from '../../../detail/DetailSkillViewController'
import { crudAssert } from '../../../index-module'
import { buildDetailEntity } from '../../support/test.utils'
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
            entities: [buildDetailEntity()],
        })
    }

    private static assertRendersDetailFewThrowsForMissmatchedOptions(
        options: Partial<DetailSkillViewControllerOptions>
    ) {
        assert.doesThrow(() => this.assertRendersDetailView(options), 'options')
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
            entities: [buildDetailEntity()],
            ...options,
        })
    }
}

class SkillViewWithDetailView extends AbstractSkillViewController {
    private detailSkillView?: DetailSkillViewController

    public dropInDetailSkillView(options: DetailSkillViewControllerOptions) {
        this.detailSkillView = this.Controller(
            'crud.detail-skill-view',
            options
        )
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
