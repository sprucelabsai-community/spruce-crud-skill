import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import MasterListCardViewController from '../../../master/MasterListCardViewController'
import { MasterSkillViewControllerOptions } from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockMasterListCard from '../../support/MockMasterListCard'
import SpyMasterSkillView from '../../support/SpyMasterSkillView'

@fake.login()
export default class MasterSkillViewTest extends AbstractCrudTest {
    private static vc: SpyMasterSkillView

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
        this.VcWithTotalEntities(1)
    }

    @test()
    protected static async throwsWhenMissingInSecondEntity() {
        this.assertThrowsMissingEntityParameters({
            entities: [
                {
                    entities: [
                        {
                            id: 'my-entity',
                            title: 'My Entity',
                            loadEvent: 'list-locations::v2020_12_25',
                        },
                        //@ts-ignore
                        {},
                    ],
                },
            ],
        })
    }

    @test()
    protected static async rendersCardForFirstEntity() {
        const entities = this.VcWithTotalEntities(1)
        vcAssert.assertSkillViewRendersCard(this.vc, entities[0].id)
    }

    @test()
    protected static async rendersCardsForAllEntities() {
        const entities = this.VcWithTotalEntities(3)
        vcAssert.assertSkillViewRendersCards(
            this.vc,
            entities.map((e) => e.id)
        )
    }

    @test()
    protected static async rendersMasterListCardForEntityCard() {
        const entities = this.VcWithTotalEntities(1)
        const cardVc = vcAssert.assertSkillViewRendersCard(
            this.vc,
            entities[0].id
        )
        vcAssert.assertRendersAsInstanceOf(cardVc, MasterListCardViewController)
    }

    @test()
    protected static async callsLoadOnFirstListCard() {
        this.VcWithTotalEntities(2)

        await this.load()

        this.listCardVcs[0].assertWasLoaded()
    }

    @test()
    protected static async doesNotCallLoadOnSecondListCard() {
        this.VcWithTotalEntities(2)
        await this.load()
        this.listCardVcs[1].assertWasLoaded()
    }

    @test()
    protected static async loadOptionsPassedToCards() {
        this.VcWithTotalEntities(1)
        await this.load()
        const options = this.views.getRouter().buildLoadOptions()
        this.listCardVcs[0].assertWasLoadedWithOptions(options)
    }

    private static get listCardVcs() {
        return this.vc.getListCardVcs() as MockMasterListCard[]
    }

    private static async load() {
        await this.views.load(this.vc)
    }

    private static VcWithTotalEntities(total: number) {
        const entities = this.buildEntities(total)

        this.vc = this.Vc({
            entities,
        })

        return entities
    }

    private static assertThrowsMissingEntityParameters(
        options: Record<string, any>
    ) {
        //@ts-ignore
        const err = assert.doesThrow(() => this.Vc(options))

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['entity.id', 'entity.title', 'entity.loadEvent'],
        })
    }

    private static Vc(options: MasterSkillViewControllerOptions) {
        return this.views.Controller(
            'crud.master-skill-view',
            options
        ) as SpyMasterSkillView
    }
}
