import {
    FormViewControllerOptions,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import {
    FormCardViewController,
    SpyFormCardViewController,
} from '@sprucelabs/spruce-form-utils'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { assert, errorAssert, generateId, test } from '@sprucelabs/test-utils'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import {
    detailFormOptions1,
    detailFormOptions2,
} from '../../support/detailFormOptions'
import MockDetailFormCard from '../../support/MockDetailFormCard'

@fake.login()
export default class DetailFormCardTest extends AbstractCrudTest {
    private static vc: MockDetailFormCard
    private static formOptions: FormViewControllerOptions<any>
    private static entityId: string

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        this.formOptions = detailFormOptions1
        this.entityId = generateId()

        this.views.setController('forms.card', SpyFormCardViewController)
        this.views.setController('crud.detail-form-card', MockDetailFormCard)

        this.vc = this.views.Controller('crud.detail-form-card', {
            onCancel: () => {},
            onSubmit: () => {},
        }) as MockDetailFormCard
    }

    @test()
    protected static async throwsWithMissing() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            this.views.Controller('crud.detail-form-card', {})
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['onSubmit', 'onCancel'],
        })
    }

    @test()
    protected static async rendersAsBusyCardToStart() {
        vcAssert.assertCardIsBusy(this.vc)
    }

    @test()
    protected static async loadThrowsWhenMissingRequired() {
        //@ts-ignore
        const err = await assert.doesThrowAsync(() => this.vc.load())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['form'],
        })
    }

    @test()
    protected static async rendersAsFormCard() {
        await this.load()
        vcAssert.assertRendersAsInstanceOf(this.vc, FormCardViewController)
    }

    @test()
    protected static async passesThroughFormToFormCard() {
        await this.loadAndAssertOptionsPassed()
    }

    @test()
    protected static async passeThroughDifferentForm() {
        this.formOptions = detailFormOptions2
        await this.loadAndAssertOptionsPassed()
    }

    @test()
    protected static async loadTriggersRender() {
        await this.load()
        vcAssert.assertTriggerRenderCount(this.vc, 1)
    }

    @test()
    protected static async noLongerBusyAfterLoad() {
        await this.load()
        vcAssert.assertCardIsNotBusy(this.vc)
    }

    private static async loadAndAssertOptionsPassed() {
        await this.load()
        this.vc.assertFormOptionsEqual(this.formOptions)
    }

    private static async load() {
        await this.vc.load({
            id: this.entityId,
            form: this.formOptions,
        })
    }
}
