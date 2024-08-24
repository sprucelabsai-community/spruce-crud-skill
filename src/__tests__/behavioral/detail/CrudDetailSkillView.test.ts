import {
    buttonAssert,
    interactor,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { SpyFormCardViewController } from '@sprucelabs/spruce-form-utils'
import { fake, TestRouter } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import CrudDetailFormCardViewController from '../../../detail/CrudDetailFormCardViewController'
import CrudDetailSkillViewController, {
    DetailForm,
    CrudDetailSkillViewArgs,
    CrudDetailSkillViewEntity,
    CrudDetailLoadAction,
} from '../../../detail/CrudDetailSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import { detailFormOptions2 } from '../../support/detailFormOptions'
import MockDetailFormCard from '../../support/MockDetailFormCard'
import { buildTestDetailEntity } from '../../support/test.utils'

@fake.login()
export default class DetailSkillViewTest extends AbstractCrudTest {
    private static vc: SpyDetailSkillView
    private static entityId: string
    private static entities: CrudDetailSkillViewEntity[]
    private static cancelDestination: SkillViewControllerId
    private static loadAction: CrudDetailLoadAction

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        TestRouter.setShouldThrowWhenRedirectingToBadSvc(false)

        this.entityId = generateId()
        this.entities = []
        this.loadAction = 'edit'
        this.cancelDestination = generateId() as SkillViewControllerId
        this.views.setController('forms.card', SpyFormCardViewController)
        this.views.setController('crud.detail-form-card', MockDetailFormCard)
        this.views.setController('crud.detail-skill-view', SpyDetailSkillView)
        this.setupWithSingleEntity()
    }

    @test()
    protected static async throwsWithMissing() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            this.views.Controller('crud.detail-skill-view', {})
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['entities', 'cancelDestination'],
        })
    }

    @test()
    protected static async throwsIfNoEntities() {
        const err = await assert.doesThrowAsync(() =>
            this.views.Controller('crud.detail-skill-view', {
                entities: [],
                cancelDestination: 'crud.root',
            })
        )
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['entities'],
        })
    }

    @test()
    protected static async rendersDetailsFormCard() {
        const detailsVc = this.assertRendersDetailsCard()

        vcAssert.assertRendersAsInstanceOf(
            detailsVc,
            CrudDetailFormCardViewController
        )
    }

    @test()
    protected static async throwsIfLoadedWithMissingEntityId() {
        await this.assertThrowsInvalidEntityId({})
    }

    @test()
    protected static async throwsIfLoadedWithInvalidEntityId() {
        await this.assertThrowsInvalidEntityId({ entity: generateId() })
    }

    @test()
    protected static async doesNotThrowIfFirstEntityIdMatches() {
        await this.loadWithEntity()
    }

    @test()
    protected static async canLoadWithSecondEntity() {
        this.setupDetailView([
            this.buildDetailEntity(generateId()),
            this.buildDetailEntity(),
        ])

        await this.loadWithEntity()
    }

    @test()
    protected static async rendersCancelButtonBeforeLoad() {
        buttonAssert.cardRendersButton(this.detailFormVc, 'cancel')
    }

    @test()
    protected static async detailCardSentFirstEntity() {
        await this.loadWithEntity()
        this.detailFormVc.assertFormOptionsEqual(this.entities[0].form)
    }

    @test()
    protected static async loadsWithSecondEntity() {
        this.setupDetailView([
            this.buildDetailEntity(generateId()),
            this.buildDetailEntity(this.entityId, detailFormOptions2),
        ])

        await this.loadWithEntity()
        this.detailFormVc.assertFormOptionsEqual(this.entities[1].form)
    }

    @test()
    protected static async stillLoadsDetailsAfterLoad() {
        await this.loadWithEntity()
        this.assertRendersDetailsCard()
    }

    @test()
    protected static async cancelAfterLoadRedirectsToDestination() {
        await this.loadWithEntity()

        await vcAssert.assertActionRedirects({
            router: this.views.getRouter(),
            destination: {
                id: this.cancelDestination,
            },
            action: async () =>
                interactor.cancelForm(this.detailFormVc.getFormVc()),
        })
    }

    @test()
    protected static async throwsIfBadAction() {
        this.loadAction = generateId() as CrudDetailLoadAction
        const err = await assert.doesThrowAsync(() => this.loadWithEntity())
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['action'],
        })
    }

    @test()
    protected static async triggersRenderOnLoad() {
        await this.loadWithEntity()
        vcAssert.assertTriggerRenderCount(this.vc, 1)
    }

    private static assertRendersDetailsCard() {
        return vcAssert.assertSkillViewRendersCard(this.vc, 'details')
    }

    private static get detailFormVc() {
        return this.vc.getDetailFormVc() as MockDetailFormCard
    }

    private static async loadWithEntity() {
        await this.load({ entity: this.entityId, action: this.loadAction })
    }

    private static buildDetailEntity(
        id?: string,
        form?: DetailForm
    ): CrudDetailSkillViewEntity {
        return buildTestDetailEntity(id ?? this.entityId, form)
    }

    private static setupDetailView(entities: CrudDetailSkillViewEntity[]) {
        this.entities = entities
        this.vc = this.views.Controller('crud.detail-skill-view', {
            entities,
            cancelDestination: this.cancelDestination,
        }) as SpyDetailSkillView
    }

    private static async assertThrowsInvalidEntityId(
        args: Partial<CrudDetailSkillViewArgs>
    ) {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            this.load({ action: 'create', ...args })
        )
        errorAssert.assertError(err, 'INVALID_ENTITY_ID', {
            entityId: args.entity,
        })
    }

    private static setupWithSingleEntity() {
        const entity = this.buildDetailEntity()

        this.setupDetailView([entity])
    }

    private static load(args: CrudDetailSkillViewArgs) {
        return this.views.load(this.vc, args)
    }
}

class SpyDetailSkillView extends CrudDetailSkillViewController {
    public getDetailFormVc() {
        return this.detailsFormCardVc
    }
}
