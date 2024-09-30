import {
    buildForm,
    buttonAssert,
    FormViewControllerOptions,
    interactor,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import {
    locationSchema,
    organizationSchema,
} from '@sprucelabs/spruce-core-schemas'
import { SpyFormCardViewController } from '@sprucelabs/spruce-form-utils'
import { fake, seed, TestRouter } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import CrudDetailFormCardViewController from '../../../detail/CrudDetailFormCardViewController'
import CrudDetailSkillViewController, {
    DetailForm,
    CrudDetailSkillViewArgs,
    CrudDetailEntity,
    CrudDetailLoadAction,
} from '../../../detail/CrudDetailSkillViewController'
import CrudListCardViewController from '../../../master/CrudListCardViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import { detailFormOptions2 } from '../../support/detailFormOptions'
import { GetLocationTargetAndPayload } from '../../support/EventFaker'
import MockCrudListCard from '../../support/MockCrudListCard'
import MockDetailFormCard from '../../support/MockDetailFormCard'
import { buildLocationDetailEntity } from '../../support/test.utils'

@fake.login()
export default class DetailSkillViewTest extends AbstractCrudTest {
    private static vc: SpyDetailSkillView
    private static entityId: string
    private static entities: CrudDetailEntity[]
    private static cancelDestination: SkillViewControllerId
    private static loadAction: CrudDetailLoadAction
    private static recordId?: string

    @seed('locations', 1)
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        TestRouter.setShouldThrowWhenRedirectingToBadSvc(false)

        this.recordId = this.locationId
        this.entityId = generateId()

        this.entities = []
        this.loadAction = 'edit'
        this.cancelDestination = generateId() as SkillViewControllerId
        this.views.setController('forms.card', SpyFormCardViewController)
        this.views.setController('crud.detail-form-card', MockDetailFormCard)
        this.views.setController('crud.detail-skill-view', SpyDetailSkillView)
        this.views.setController('crud.list-card', MockCrudListCard)
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
        const err = await assert.doesThrowAsync(() => this.setupDetailView([]))
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['entities'],
        })
    }

    @test()
    protected static async throwsIfMissingInFirstEntity() {
        const entities = [{}]
        await this.assertThrowsMissingOnEntity(entities)
    }

    @test()
    protected static async throwsIfMissingInSecondEntity() {
        const entities = [this.buildDetailEntity(), {}]
        await this.assertThrowsMissingOnEntity(entities)
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
        buttonAssert.cardRendersButton(this.detailFormCardVc, 'cancel')
    }

    @test()
    protected static async detailCardSentFirstEntity() {
        await this.loadWithEntity()
        this.detailFormCardVc.assertFormOptionsEqual(this.firstEntity.form)
    }

    @test()
    protected static async loadsWithSecondEntity() {
        this.setupDetailView([
            this.buildDetailEntity(generateId()),
            this.buildDetailEntity(this.entityId, detailFormOptions2),
        ])

        await this.loadWithEntity()
        this.detailFormCardVc.assertFormOptionsEqual(this.entities[1].form)
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
            action: async () => interactor.cancelForm(this.detailFormVc),
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

    @test()
    protected static async usesGenerateTitleOnEntityToSetTitleOnDetailFormCard() {
        const entity = this.buildDetailEntity(this.entityId)
        const title = generateId()
        entity.renderTitle = () => title
        this.setupDetailView([entity])
        await this.loadWithEntity()
        this.assertFormCardHeaderTitleEquals(title)
    }

    @test()
    protected static async emitsLoadLocationEventOnLoadIfIdSent() {
        let passedTarget: GetLocationTargetAndPayload['target'] | undefined

        await this.eventFaker.fakeGetLocation(({ target }) => {
            passedTarget = target
        })

        await this.loadWithRecordId(this.locationId)

        assert.isEqualDeep(passedTarget, {
            locationId: this.locationId,
        })
    }

    @test()
    protected static async emitsLoadOrganizationEventOnLoadIfIdSent() {
        this.setupDetailViewWithOrganizationEntity()
        await this.loadWithRecordId(this.organizationId)
    }

    @test()
    protected static async loadBuildPayloadGetsTheRecordId() {
        let passedRecordId: string | undefined
        this.firstEntity.load.buildPayload = async (recordId) => {
            passedRecordId = recordId
            return undefined
        }

        await this.loadWithRecordId(this.locationId)
        assert.isEqual(
            passedRecordId,
            this.locationId,
            `Record id not passed to buildPayload`
        )
    }

    @test()
    protected static async populatesFormWithResponseFromGetLocation() {
        this.firstLocation.num = generateId()

        await this.setupWithLocationFormAndLoad()

        this.assertFormValuesEqual({
            name: this.firstLocation.name,
            address: this.firstLocation.address,
            num: this.firstLocation.num,
        })
    }

    @test()
    protected static async populatesFormWithResponseFromGetOrganization() {
        this.setupDetailViewWithOrganizationEntity()
        await this.loadWithRecordId(this.organizationId)

        this.assertFormValuesEqual({
            name: this.firstOrganization.name,
            address: this.firstOrganization.address,
        })
    }

    @test()
    protected static async throwsIfLoadActionIsEditAndNoRecordId() {
        delete this.recordId

        const err = await assert.doesThrowAsync(() => this.loadWithEntity())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['recordId'],
        })
    }

    @test()
    protected static async emitsCreateEventOnSubmitWithoutRecordId() {
        this.setLoadAction('create')
        await this.loadWithEntity()

        let wasHit = false

        await this.eventFaker.fakeCreateLocation(() => {
            wasHit = true
        })

        await this.detailFormVc.setValues({
            ...this.firstLocation,
        })

        await interactor.submitForm(this.detailFormVc)

        assert.isTrue(wasHit, `Submitting form did not emit create event`)
    }

    @test()
    protected static async renderTitleTakesInValues() {
        const entity = this.buildDetailEntity(this.entityId)
        let passedValues: Record<string, any> | undefined

        entity.renderTitle = (values) => {
            passedValues = values
            return generateId()
        }

        this.setupDetailView([entity])

        await this.loadWithRecordId(this.locationId)
        assert.isEqualDeep(passedValues, this.firstLocation)
    }

    @test()
    protected static async rendersCardForFirstRelatedOfFirstEntity() {
        const entity = this.buildDetailEntity(this.entityId)
        const relatedId = generateId()
        entity.relatedEntities = [this.buildLocationListEntity(relatedId)]
        this.setupDetailView([entity])
        const cardVc = await this.loadAndAssertRendersCard(relatedId)
        vcAssert.assertRendersAsInstanceOf(cardVc, CrudListCardViewController)
    }

    @test()
    protected static async rendersCardForSecondRelatedOfFirstEntity() {
        const relatedId = this.setupWith2RelatedEntitiesAndGetSecondId()
        await this.loadAndAssertRendersCard(relatedId)
    }

    @test()
    protected static async rendersCardForFirstRelatedOfSecondEntity() {
        const entity = this.buildDetailEntity(generateId())
        const relatedId = generateId()
        entity.relatedEntities = [this.buildLocationListEntity(relatedId)]
        this.setupDetailView([this.buildDetailEntity(), entity])
        this.entityId = entity.id
        await this.loadAndAssertRendersCard(relatedId)
    }

    @test()
    protected static async loadsFirstRelatedEntityListCard() {
        const relatedCard = await this.loadWith2RelatedAndGetFirstRelatedCard()
        relatedCard.assertWasLoaded()
    }

    @test()
    protected static async loadsSecondRelatedCard() {
        this.setupWith2RelatedEntitiesAndGetSecondId()
        const relatedCard = this.getRelatedCard(
            this.entities[0].relatedEntities![1].id
        )
        await this.loadWithFirstLocation()
        relatedCard.assertWasLoaded()
    }

    @test()
    protected static async isPassedOptionsAndValuesOnLoad() {
        const relatedCard = await this.loadWith2RelatedAndGetFirstRelatedCard()
        const options = this.views.getRouter().buildLoadOptions()
        const values = this.fakedLocations[0]

        relatedCard.assertWasLoadedWithOptions(options, values)
    }

    @test()
    protected static async doesNotRenderRelatedCardsForEntityNotBeingViewed() {
        const entity = this.buildDetailEntity(generateId())
        const relatedId = generateId()
        entity.relatedEntities = [this.buildLocationListEntity(relatedId)]
        this.setupDetailView([this.buildDetailEntity(), entity])
        await this.loadWithFirstLocation()

        vcAssert.assertSkillViewDoesNotRenderCard(this.vc, relatedId)
        const relatedCard = this.getRelatedCard(relatedId)
        relatedCard.assertWasNotLoaded()
    }

    @test()
    protected static async doesNotLoadRelatedIfRequiresDetailIdAndNoRecordIdPassed() {
        const entity = this.buildDetailEntity()
        const related = this.buildLocationListEntity()

        let wasHit = false
        await this.eventFaker.fakeListLocations(() => {
            wasHit = true
        })

        related.doesRequireDetailRecord = true

        entity.relatedEntities = [related]

        this.setupDetailView([entity])
        delete this.recordId

        this.setLoadAction('create')
        await this.loadWithEntity()

        assert.isFalse(wasHit, `Related entity tried to emit list event!`)
    }

    private static async loadWith2RelatedAndGetFirstRelatedCard() {
        const relatedId = this.setupWith2RelatedEntitiesAndGetSecondId()
        const relatedCard = this.getRelatedCard(relatedId)
        await this.loadWithFirstLocation()
        return relatedCard
    }

    private static async loadWithFirstLocation() {
        await this.loadWithRecordId(this.fakedLocations[0].id)
    }

    private static getRelatedCard(relatedId: string) {
        return this.vc.getRelatedCardVc(relatedId)
    }

    private static setupWith2RelatedEntitiesAndGetSecondId() {
        const entity = this.buildDetailEntity(this.entityId)
        const relatedId = generateId()
        entity.relatedEntities = [
            this.buildLocationListEntity(generateId()),
            this.buildLocationListEntity(relatedId),
        ]
        this.setupDetailView([entity])
        return relatedId
    }

    private static async loadAndAssertRendersCard(relatedId: string) {
        await this.loadWithFirstLocation()
        return vcAssert.assertSkillViewRendersCard(this.vc, relatedId)
    }

    private static assertFormCardHeaderTitleEquals(title: string) {
        const card = this.views.render(this.vc.getDetailFormVc())
        assert.isEqual(card.header?.title, title)
    }

    private static setupDetailViewWithOrganizationEntity() {
        const entity = this.buildDetailEntity(
            this.entityId,
            buildForm({
                id: 'organization',
                schema: organizationSchema,
                sections: [{ fields: ['name', 'address'] }],
            })
        )
        entity.load = {
            fqen: 'get-organization::v2020_12_25',
            responseKey: 'organization',
            buildTarget: (recordId: string) => ({
                organizationId: recordId,
            }),
        }
        this.setupDetailView([entity])
    }

    private static get firstOrganization() {
        return this.fakedOrganizations[0]
    }

    private static async setupWithFormAndLoadWithRecordid(
        form: FormViewControllerOptions<any>,
        id: string
    ) {
        const entity = this.buildDetailEntity(this.entityId, form)
        this.setupDetailView([entity])
        await this.loadWithRecordId(id)
    }

    private static assertFormValuesEqual(expected: Record<string, any>) {
        const values = this.detailFormVc.getValues() as any
        assert.isEqualDeep(values, expected)
    }

    private static async loadWithRecordId(id: string) {
        this.setLoadId(id)
        await this.loadWithEntity()
    }

    private static get firstLocation() {
        return this.fakedLocations[0]
    }

    private static get locationId(): string {
        return this.firstLocation.id
    }

    private static setLoadId(id: string) {
        this.recordId = id
    }

    private static assertRendersDetailsCard() {
        return vcAssert.assertSkillViewRendersCard(this.vc, 'details')
    }

    private static setLoadAction(action: CrudDetailLoadAction) {
        this.loadAction = action
    }

    private static async assertThrowsMissingOnEntity(
        entities: Partial<CrudDetailEntity>[]
    ) {
        const err = await assert.doesThrowAsync(() =>
            //@ts-ignore
            this.setupDetailView(entities)
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: [
                'entity.id',
                'entity.form',
                'entity.load',
                'entity.load.fqen',
                'entity.load.responseKey',
                'entity.load.buildTarget',
            ],
        })
    }

    private static async loadWithEntity() {
        await this.load({
            entity: this.entityId,
            action: this.loadAction,
            recordId: this.recordId,
        })
    }

    private static buildDetailEntity(
        id?: string,
        form?: DetailForm
    ): CrudDetailEntity {
        return buildLocationDetailEntity(
            id ?? this.entityId,
            form ??
                buildForm({
                    id: 'location',
                    schema: locationSchema,
                    sections: [{ fields: ['name'] }],
                })
        )
    }

    private static setupDetailView(entities: CrudDetailEntity[]) {
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

    private static async setupWithLocationFormAndLoad() {
        await this.setupWithFormAndLoadWithRecordid(
            buildForm({
                id: 'location',
                schema: locationSchema,
                sections: [{ fields: ['name', 'address', 'num'] }],
            }),
            this.locationId
        )
    }

    private static get detailFormCardVc() {
        return this.vc.getDetailFormVc() as MockDetailFormCard
    }

    private static get organizationId() {
        return this.firstOrganization.id
    }

    private static get detailFormVc() {
        return this.detailFormCardVc.getFormVc()
    }

    private static get firstEntity() {
        return this.entities[0]
    }
}

class SpyDetailSkillView extends CrudDetailSkillViewController {
    public getRelatedCardVc(relatedId: string) {
        const match = this.getRelatedCardVcs().find(
            (vc) => vc.getEntityId() === relatedId
        )
        assert.isTruthy(match, `Could not find that related card.`)

        return match
    }

    public getRelatedCardVcs() {
        const relatedCardVcs = []
        for (const entities of Object.values(this.relatedEntityVcsByEntityId)) {
            relatedCardVcs.push(...entities)
        }
        return relatedCardVcs as MockCrudListCard[]
    }

    public getDetailFormVc() {
        return this.detailsFormCardVc
    }
}
