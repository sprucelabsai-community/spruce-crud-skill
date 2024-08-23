import {
    interactor,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import MasterListCardViewController from '../../../master/MasterListCardViewController'
import {
    MasterSkillViewControllerOptions,
    MasterSkillViewListEntity,
} from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockMasterListCard from '../../support/MockMasterListCard'
import SpyMasterSkillView from '../../support/SpyMasterSkillView'
import { buildLocationTestEntity } from '../../support/test.utils'

@fake.login()
export default class MasterSkillViewTest extends AbstractCrudTest {
    private static vc: SpyMasterSkillView
    private static clickRowDestination?: SkillViewControllerId

    protected static async beforeEach() {
        await super.beforeEach()
        delete this.clickRowDestination
    }

    @test()
    protected static async throwsWithMissingEntities() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            this.Vc('crud.master-skill-view', {})
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['entities'],
        })
    }

    @test()
    protected static async throwsWithZeroEntities() {
        const err = assert.doesThrow(() =>
            this.Vc({
                entities: [],
            })
        )

        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['entities'],
        })
    }

    @test()
    protected static async throwsIfFirstEntityIsMissingRequired() {
        this.assertThrowsMissingEntityParameters({
            entities: [{}],
        })
    }

    @test()
    protected static async canCreateWithOneEntity() {
        this.setupVcWithTotalEntities(1)
    }

    @test()
    protected static async throwsWhenMissingInSecondEntity() {
        this.assertThrowsMissingEntityParameters({
            entities: [
                {
                    entities: [
                        buildLocationTestEntity(),
                        //@ts-ignore
                        {},
                    ],
                },
            ],
        })
    }

    @test()
    protected static async rendersCardForFirstEntity() {
        const entities = this.setupVcWithTotalEntities(1)
        vcAssert.assertSkillViewRendersCard(this.vc, entities[0].id)
    }

    @test()
    protected static async rendersCardsForAllEntities() {
        const entities = this.setupVcWithTotalEntities(3)
        vcAssert.assertSkillViewRendersCards(
            this.vc,
            entities.map((e) => e.id)
        )
    }

    @test()
    protected static async rendersMasterListCardForEntityCard() {
        const entities = this.setupVcWithTotalEntities(1)
        const cardVc = vcAssert.assertSkillViewRendersCard(
            this.vc,
            entities[0].id
        )
        vcAssert.assertRendersAsInstanceOf(cardVc, MasterListCardViewController)
    }

    @test()
    protected static async callsLoadOnFirstListCard() {
        this.setupVcWithTotalEntities(2)

        await this.load()

        this.listCardVcs[0].assertWasLoaded()
    }

    @test()
    protected static async doesNotCallLoadOnSecondListCard() {
        this.setupVcWithTotalEntities(2)
        await this.load()
        this.listCardVcs[1].assertWasLoaded()
    }

    @test()
    protected static async loadOptionsPassedToCards() {
        this.setupVcWithTotalEntities(1)
        await this.load()
        const options = this.views.getRouter().buildLoadOptions()
        this.listCardVcs[0].assertWasLoadedWithOptions(options)
    }

    @test()
    protected static async tryingToSetTargetOnNonExistentListCardThrows() {
        const err = assert.doesThrow(() =>
            this.setTarget(generateId(), undefined)
        )
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['listId'],
        })
    }

    @test()
    protected static async canPassTargetThroughToListCard() {
        const id = this.setupWith1EntityAndGetId()

        const target = {
            organizationId: generateId(),
        }

        this.setTarget(id, target)
        this.assertTargetForListAtIndexEquals(0, target)
    }

    @test()
    protected static async canSetTargetOnSecondListCard() {
        const id = this.setupWith2EntitiesAndGetSecondId()

        const target = {
            locationId: generateId(),
        }

        this.setTarget(id, target)
        this.assertTargetForListAtIndexEquals(1, target)
    }

    @test()
    protected static async tryingToSetPayloadOnNonExistentListCardThrows() {
        const err = assert.doesThrow(() =>
            this.setPayload(generateId(), undefined)
        )
        errorAssert.assertError(err, 'INVALID_PARAMETERS', {
            parameters: ['listId'],
        })
    }

    @test()
    protected static async canPassPayloadToFirstListCard() {
        const id = this.setupWith1EntityAndGetId()

        const payload = {
            organizationId: generateId(),
        }

        this.setPayload(id, payload)
        this.assertPayloadForListAtIndexEquals(0, payload)
    }

    @test()
    protected static async canPassPayloadToSecondListCard() {
        const id = this.setupWith2EntitiesAndGetSecondId()

        const payload = {
            locationId: generateId(),
        }

        this.setPayload(id, payload)
        this.assertPayloadForListAtIndexEquals(1, payload)
    }

    @test('can redirect on click to crud.root', 'crud.root')
    @test('can redirect on click to crud.detail-example', 'crud.detail-example')
    @seed('locations', 1)
    protected static async canSetClickRowDestinationAndClickForRedirect(
        destination: SkillViewControllerId
    ) {
        this.clickRowDestination = destination
        const [entity] = this.setupVcWithTotalEntities(1)
        await this.load()

        await vcAssert.assertActionRedirects({
            action: () => this.clickFirstRowOfFirstList(),
            destination: {
                id: this.clickRowDestination,
                args: {
                    action: 'edit',
                    entityId: entity.id,
                    recordId: this.fakedLocations[0].id,
                },
            },
            router: this.views.getRouter(),
        })
    }

    @test()
    @seed('locations', 1)
    protected static async clickingOnRowDoesNothingIfNoDestinationSet() {
        this.setupWith1EntityAndGetId()
        await this.load()
        await this.clickFirstRowOfFirstList()
    }

    private static clickFirstRowOfFirstList(): any {
        return interactor.clickRow(this.listCardVcs[0].getListVc(), 0)
    }

    private static setPayload(id: string, payload?: Record<string, any>) {
        this.vc.setPayload(id, payload)
    }

    private static setupWith2EntitiesAndGetSecondId() {
        const id = generateId()
        const entity = this.buildLocationTestEntity(id)
        this.setupWithEntities([this.buildLocationTestEntity(), entity])
        return id
    }

    private static setupWith1EntityAndGetId() {
        const id = generateId()

        const entity = this.buildLocationTestEntity(id)
        this.setupWithEntities([entity])
        return id
    }

    private static assertTargetForListAtIndexEquals(
        idx: number,
        target?: Record<string, any>
    ) {
        this.listCardVcs[idx].assertTargetEquals(target)
    }

    private static assertPayloadForListAtIndexEquals(
        idx: number,
        payload: Record<string, any>
    ) {
        this.listCardVcs[idx].assertPayloadEquals(payload)
    }

    private static setTarget(id: string, target?: Record<string, any>) {
        this.vc.setTarget(id, target)
    }

    private static get listCardVcs() {
        return this.vc.getListCardVcs() as MockMasterListCard[]
    }

    private static async load() {
        await this.views.load(this.vc)
    }

    private static setupVcWithTotalEntities(total: number) {
        const entities = this.buildEntities(total)

        this.setupWithEntities(entities)

        return entities
    }

    private static setupWithEntities(
        entities: MasterSkillViewListEntity<any, any>[]
    ) {
        this.vc = this.Vc({
            clickRowDestination: this.clickRowDestination,
            entities,
        })
    }

    private static assertThrowsMissingEntityParameters(
        options: Record<string, any>
    ) {
        //@ts-ignore
        const err = assert.doesThrow(() => this.Vc(options))

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: [
                'entity.id',
                'entity.title',
                'entity.load.fqen',
                'entity.load.responseKey',
                'entity.load.rowTransformer',
            ],
        })
    }

    private static Vc(options: MasterSkillViewControllerOptions) {
        return this.views.Controller(
            'crud.master-skill-view',
            options
        ) as SpyMasterSkillView
    }
}
