import {
    renderUtil,
    SkillViewController,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { ViewFixture } from '@sprucelabs/spruce-test-fixtures'
import { assert, RecursivePartial } from '@sprucelabs/test-utils'
import { MasterListCardViewController } from '../index-utils'
import MasterSkillViewController, {
    MasterSkillViewListEntity,
} from '../master/MasterSkillViewController'

let views: ViewFixture | undefined

const crudAssert = {
    beforeEach(viewFixture: ViewFixture) {
        assertOptions(
            { viewFixture },
            ['viewFixture'],
            `You gotta call me like this: crudAssert.beforeEach(this.views)`
        )

        views = viewFixture
    },

    skillViewRendersMasterView(skillView: SkillViewController) {
        assertBeforeEachRan()

        assertViewSetToFactory(
            'crud.master-skill-view',
            'MasterSkillViewController'
        )

        assertViewSetToFactory(
            'crud.master-list-card',
            'MasterListCardViewController'
        )

        assertOptions({ skillView }, ['skillView'])

        const rendered = renderUtil.render(skillView)

        try {
            vcAssert.assertControllerInstanceOf(
                rendered.controller!,
                MasterSkillViewController
            )
        } catch {
            assert.fail(`You are not rendering a MasterSkillViewController. Follow these steps:
1. In your constructor (after setting the Views to the ViewFactory): this.masterSkillView = this.Controller('crud.master-skill-view',{}).
2. Fix the errors with stub data
3. Update your SkillView's render method: 
    public render(): SkillView { 
        return this.masterSkillView.render() 
    }`)
        }
    },

    async skillViewLoadsMasterView(skillView: SkillViewController) {
        assertOptions({ skillView }, ['skillView'])

        await views?.load(skillView)

        const rendered = renderUtil.render(skillView)
        const controller = rendered.controller as SpyMasterSkillView

        assert.isTrue(
            controller.wasLoaded,
            `You are not loading your MasterSkillViewController on the the load of your SkillView. Follow these steps:
			
1. Make sure your load(...) method signature of your SkillView is 'public async load(options: SkillViewControllerLoadOptions) {...}'
2. In your SkillView's load(...) method, add: await this.masterSkillView.load(options)`
        )
    },

    async assertMasterSkillViewRendersList(
        skillView: SkillViewController,
        id: string,
        expected?: ExpectedListEntityOptions
    ) {
        assertOptions({ skillView, id }, ['skillView', 'id'])

        let spyMasterListCard: SpyMasterListCard | undefined

        try {
            const cardVc = vcAssert.assertSkillViewRendersCard(skillView, id)

            spyMasterListCard = vcAssert.assertRendersAsInstanceOf(
                cardVc,
                MasterListCardViewController
            ) as SpyMasterListCard
        } catch {
            assert.fail(
                `Your MasterSkillView is not rendering a list card for the entity with the expected id.`
            )
        }

        if (expected) {
            assert.doesInclude(
                spyMasterListCard?.entity,
                expected,
                'Your configuration does not match!'
            )
        }
    },
}

export default crudAssert
function assertViewSetToFactory(id: string, className: string) {
    assert.isTrue(
        views?.getFactory().hasController(id),
        `You need to drop the 'crud.master-skill-view' SkillView into the ViewFactory. Here's how:
		
1. Import the MasterSkillViewController into your SkillView: import { ${className} } from '@sprucelabsai-community/spruce-crud-views-utils'.
2. Drop in the Controller in your SkillView's constructor: this.getFactory().setController('${id}', ${className}).`
    )
}

function assertBeforeEachRan() {
    assert.isTruthy(
        views,
        `You need to call crudAssert.beforeEach(this.views) in your test. You gotta do that before you can use this assertion library.`
    )
}

class SpyMasterSkillView extends MasterSkillViewController {
    public wasLoaded = false
}

class SpyMasterListCard extends MasterListCardViewController {
    public entity!: MasterSkillViewListEntity
}

export type ExpectedListEntityOptions = Omit<
    RecursivePartial<MasterSkillViewListEntity>,
    'id'
>
