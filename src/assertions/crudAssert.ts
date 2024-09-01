import {
    Client,
    MockActiveRecordCard,
    renderUtil,
    SkillViewController,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import {
    EventContract,
    EventName,
    SkillEventContract,
} from '@sprucelabs/mercury-types'
import { assertOptions } from '@sprucelabs/schema'
import { ViewFixture } from '@sprucelabs/spruce-test-fixtures'
import { assert, RecursivePartial } from '@sprucelabs/test-utils'
import CrudDetailSkillViewController, {
    DetailSkillViewControllerOptions,
} from '../detail/CrudDetailSkillViewController'
import CrudListCardViewController from '../master/CrudListCardViewController'
import CrudMasterSkillViewController, {
    CrudMasterSkillViewControllerOptions,
    CrudListEntity,
} from '../master/CrudMasterSkillViewController'

let views: ViewFixture | undefined

const crudAssert = {
    beforeEach(viewFixture: ViewFixture) {
        assertOptions(
            { viewFixture },
            ['viewFixture'],
            `You gotta call me like this: crudAssert.beforeEach(this.views)`
        )

        views = viewFixture
        views.setController('active-record-card', MockActiveRecordCard)
    },

    skillViewRendersMasterView(
        skillView: SkillViewController,
        expectedOptions?: Partial<CrudMasterSkillViewControllerOptions>
    ) {
        assertBeforeEachRan()

        assertViewSetToFactory(
            'crud.master-skill-view',
            'CrudMasterSkillViewController'
        )

        assertViewSetToFactory(
            'crud.list-card',
            'CrudMasterListCardViewController'
        )

        assertOptions({ skillView }, ['skillView'])

        const rendered = renderUtil.render(skillView)
        let vc: SpyMasterSkillView | undefined

        try {
            vc = vcAssert.assertControllerInstanceOf(
                rendered.controller!,
                CrudMasterSkillViewController
            ) as SpyMasterSkillView
        } catch {
            assert.fail(`You are not rendering a CrudMasterSkillViewController. Follow these steps:
1. In your constructor (after setting the Views to the ViewFactory): this.masterSkillView = this.Controller('crud.master-skill-view',{}).
2. Fix the errors with stub data
3. Update your SkillView's render method: 
    public render(): SkillView { 
        return this.masterSkillView.render() 
    }`)
        }

        if (Object.keys(expectedOptions ?? {}).length > 0) {
            assert.doesInclude(
                vc?.options,
                expectedOptions,
                `The expected options do not match!`
            )
        }

        return vc!
    },

    async skillViewLoadsMasterView(skillView: SkillViewController) {
        assertBeforeEachRan()

        assertOptions({ skillView }, ['skillView'])

        await views?.load(skillView)

        const rendered = renderUtil.render(skillView)
        const controller = rendered.controller as SpyMasterSkillView

        assert.isTrue(
            controller.wasLoaded,
            `You are not loading your CrudMasterSkillViewController on the the load of your SkillView. Follow these steps:
			
1. Make sure your load(...) method signature of your SkillView is 'public async load(options: SkillViewControllerLoadOptions) {...}'
2. In your SkillView's load(...) method, add: await this.masterSkillView.load(options)`
        )
    },

    masterSkillViewRendersList<
        Contract extends EventContract = SkillEventContract,
        Fqen extends EventName<Contract> = EventName<Contract>,
    >(
        skillView: SkillViewController,
        id: string,
        expectedOptions?: ExpectedListEntityOptions<Contract, Fqen>
    ) {
        assertBeforeEachRan()
        assertOptions({ skillView, id }, ['skillView', 'id'])

        let spyMasterListCard: SpyCrudListCard | undefined

        try {
            const cardVc = vcAssert.assertSkillViewRendersCard(skillView, id)

            spyMasterListCard = vcAssert.assertRendersAsInstanceOf(
                cardVc,
                CrudListCardViewController
            ) as SpyCrudListCard
        } catch {
            assert.fail(
                `Your MasterSkillView is not rendering a list card for the entity with the id of '${id}'.`
            )
        }

        if (expectedOptions) {
            const actual = spyMasterListCard?.entity

            assert.doesInclude(
                actual,
                expectedOptions,
                'Your configuration does not match!'
            )
        }

        return spyMasterListCard!
    },

    async masterListCardRendersRow(
        skillView: SkillViewController,
        entityId: string,
        rowId: string
    ) {
        assertBeforeEachRan()
        assertOptions(
            {
                skillView,
                entityId,
                rowId,
            },
            ['skillView', 'entityId', 'rowId']
        )

        const cardListVc = this.masterSkillViewRendersList(skillView, entityId)

        await views?.load(skillView)

        cardListVc.activeRecordCardVc.assertRendersRow(rowId)
    },

    async masterListLoadsWithTarget(
        skillView: SkillViewController,
        entityId: string,
        expectedTarget?: Record<string, any>
    ) {
        assertBeforeEachRan()

        assertOptions(
            {
                skillView,
                entityId,
                expectedTarget,
            },
            ['skillView', 'entityId', 'expectedTarget']
        )

        await views?.load(skillView)

        const cardListVc = await this.masterSkillViewRendersList(
            skillView,
            entityId
        )

        assert.isEqualDeep(
            cardListVc.activeRecordCardVc.getTarget(),
            expectedTarget,
            `The target of list ${entityId} is not being set to the expected value. Try 'this.masterSkillView.setListTarget(...)'`
        )
    },

    skillViewRendersDetailView(
        skillView: SkillViewController,
        options?: ExpectedDetailSkilViewOptions
    ) {
        assertBeforeEachRan()

        assertViewSetToFactory(
            'crud.detail-skill-view',
            'CrudDetailSkillViewController'
        )

        assertViewSetToFactory(
            'crud.detail-form-card',
            'CrudDetailFormCardViewController'
        )

        assertOptions(
            {
                skillView,
            },
            ['skillView']
        )

        const rendered = renderUtil.render(skillView)
        let vc: SpyDetailSkillView | undefined

        try {
            vc = vcAssert.assertControllerInstanceOf(
                rendered.controller!,
                CrudDetailSkillViewController
            ) as SpyDetailSkillView
        } catch {
            assert.fail(`You are not rendering a DetailSkillViewController. Follow these steps:
1. In your constructor (after setting the Views to the ViewFactory): this.detailSkillView = this.Controller('crud.detail-skill-view',{}).
2. Fix the errors with stub data
3. Update your SkillView's render method: 
    public render(): SkillView { 
        return this.detailSkillView.render() 
    }`)
        }

        if (options) {
            assert.doesInclude(
                vc?.options,
                options,
                `The options you passed to your DetailSkillView don't match the expected options.`
            )
        }

        return vc!
    },

    async skillViewLoadsDetailView(skillView: SkillViewController) {
        assertOptions({ skillView }, ['skillView'])

        const vc = this.skillViewRendersDetailView(skillView)

        const entityId = vc?.options.entities[0].id
        await loadSkillViewWithDetailView(skillView, entityId)

        assert.isTrue(
            vc?.wasLoaded,
            `You are not loading your CrudDetailSkillViewController on the the load of your SkillView. Follow these steps:
			
1. Make sure your load(...) method signature of your SkillView is 'public async load(options: SkillViewControllerLoadOptions<CrudDetailSkillViewArgs>) {...}'
2. In your SkillView's load(...) method, add: await this.detailSkillView.load(options)`
        )

        try {
            vcAssert.assertTriggerRenderCount(skillView, 1)
        } catch {
            assert.fail(
                `You are not triggering a render after loading your DetailSkillView. Make sure you call 'this.triggerRender()' after loading your DetailSkillView.`
            )
        }
    },

    async addDestinationArgsEqual(
        skillView: SkillViewController,
        entityId: string,
        expectedArgs: Record<string, any>
    ) {
        assertOptions(
            {
                skillView,
                entityId,
                expectedArgs,
            },
            ['skillView', 'entityId', 'expectedArgs']
        )

        this.masterSkillViewRendersList(skillView, entityId)
        const vc = this.skillViewRendersMasterView(skillView)

        await views?.load(skillView)

        assert.isEqualDeep(
            vc.addDestinationArgs[entityId],
            expectedArgs,
            `The args you found do not match. Try calling 'this.masterSkillView.setAddDestinationArgs('${entityId}', ...)' in your Skill View's load(...) method.`
        )
    },

    async detailLoadTargetEquals(options: {
        skillView: SkillViewController
        entityId: string
        recordId?: string
        expectedTarget: Record<string, any>
    }) {
        const { skillView, recordId, expectedTarget, entityId } = assertOptions(
            options,
            ['skillView', 'entityId', 'recordId', 'expectedTarget']
        )

        const detailSvc = this.skillViewRendersDetailView(skillView)
        detailSvc.relatedEntityVcsByEntityId = {}

        const client = await detailSvc.connectToApi()
        let passedTarget: Record<string, any> | undefined

        const originalEmitAndFlattenResponses =
            client.emitAndFlattenResponses.bind(client)

        //@ts-ignore
        client.emitAndFlattenResponses = async (
            _: any,
            targetAndPayload: Record<string, any>
        ) => {
            passedTarget = targetAndPayload?.target
            return originalEmitAndFlattenResponses(_, targetAndPayload)
        }

        await loadSkillViewWithDetailView(skillView, entityId, recordId)

        assert.isEqualDeep(
            passedTarget,
            expectedTarget,
            `The load target does not match the expected.`
        )
    },

    async detailRendersRelatedEntity(options: {
        skillView: SkillViewController
        entityId: string
        recordId?: string
        relatedId: string
        expectedOptions?: RecursivePartial<CrudListEntity>
    }) {
        const { skillView, entityId, relatedId, expectedOptions, recordId } =
            assertOptions(options, ['skillView', 'entityId', 'relatedId'])

        const detailSvc = this.skillViewRendersDetailView(skillView)
        const relatedCardVc = getRelatedListCardVc(
            detailSvc,
            entityId,
            relatedId
        )

        await loadSkillViewWithDetailView(skillView, entityId, recordId)

        if (expectedOptions) {
            assertRelatedListCardOptionsEqual(relatedCardVc, expectedOptions)
        }

        return relatedCardVc as SpyCrudListCard
    },

    async detailRendersRelatedRow(options: {
        skillView: SkillViewController
        entityId: string
        recordId?: string
        relatedId: string
        rowId: string
    }) {
        const { rowId } = assertOptions(options, [
            'skillView',
            'entityId',
            'relatedId',
            'rowId',
        ])

        const detailSvc = await this.detailRendersRelatedEntity(options)

        detailSvc.activeRecordCardVc.assertRendersRow(rowId)
    },
}

export default crudAssert

async function loadSkillViewWithDetailView(
    skillView: SkillViewController<Record<string, any>>,
    entityId: string,
    recordId?: string
) {
    await views?.load(skillView, {
        action: recordId ? 'edit' : 'create',
        recordId,
        entity: entityId,
    })
}

function getRelatedListCardVc(
    detailSvc: SpyDetailSkillView,
    entityId: string,
    relatedId: string
) {
    const relatedVcs = detailSvc.relatedEntityVcsByEntityId[entityId] as
        | SpyCrudListCard[]
        | undefined

    assert.isTruthy(
        relatedVcs,
        `I could not find any related entities with the id of '${relatedId}' in your '${entityId} detail entity'. Make sure you set the 'relatedEntities' property of your '${entityId}' entity configuration.`
    )

    const relatedCardVc = relatedVcs.find((vc) => vc.entity.id === relatedId)

    assert.isTruthy(
        relatedCardVc,
        `I could not find any related entities with the id of '${relatedId}' in your '${entityId} detail entity'. Make sure you set the 'relatedEntities' property of your '${entityId}' entity configuration.`
    )
    return relatedCardVc
}

function assertRelatedListCardOptionsEqual(
    relatedCardVc: SpyCrudListCard,
    expectedOptions: RecursivePartial<CrudListEntity>
) {
    const actual = relatedCardVc.entity

    if (actual?.list.buildTarget && expectedOptions.list?.target) {
        assert.isEqualDeep(
            relatedCardVc.activeRecordCardVc.getTarget(),
            expectedOptions.list?.target,
            `The target you expected in your related entity does not match what I found!`
        )

        delete expectedOptions.list?.target

        if (Object.keys(expectedOptions.list!).length === 0) {
            delete expectedOptions.list
        }
    }

    if (Object.keys(expectedOptions).length > 0) {
        assert.doesInclude(
            actual,
            expectedOptions,
            `The options you expected in your related entity do not match what I found!`
        )
    }
}

function assertViewSetToFactory(id: string, className: string) {
    assert.isTrue(
        views?.getFactory().hasController(id),
        `You need to drop the '${id}' SkillView into the ViewFactory. Here's how:
		
1. Import the ${className} into your SkillView: import { ${className} } from '@sprucelabsai-community/spruce-crud-views-utils'.
2. Drop in the Controller in your SkillView's constructor: this.getVcFactory().setController('${id}', ${className}).`
    )
}

function assertBeforeEachRan() {
    assert.isTruthy(
        views,
        `You need to call crudAssert.beforeEach(this.views) in your test. You gotta do that before you can use this assertion library.`
    )
}

class SpyMasterSkillView extends CrudMasterSkillViewController {
    public wasLoaded = false
    public options!: CrudMasterSkillViewControllerOptions
    public addDestinationArgs: Record<string, Record<string, any>> = {}
}

class SpyCrudListCard extends CrudListCardViewController {
    public entity!: CrudListEntity<any>
    public activeRecordCardVc!: MockActiveRecordCard
}

class SpyDetailSkillView extends CrudDetailSkillViewController {
    public options!: DetailSkillViewControllerOptions
    public wasLoaded = false
    public connectToApi!: () => Promise<Client>
    public relatedEntityVcsByEntityId: Record<
        string,
        CrudListCardViewController[]
    > = {}
}

export type ExpectedListEntityOptions<
    Contract extends EventContract = SkillEventContract,
    Fqen extends EventName<Contract> = EventName<Contract>,
> = Omit<RecursivePartial<CrudListEntity<Contract, Fqen>>, 'id'>

export type ExpectedDetailSkilViewOptions =
    RecursivePartial<DetailSkillViewControllerOptions>
