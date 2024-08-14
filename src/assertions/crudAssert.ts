import {
    renderUtil,
    SkillViewController,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { ViewFixture } from '@sprucelabs/spruce-test-fixtures'
import { assert } from '@sprucelabs/test-utils'
import { MasterSkillViewController } from '../master/MasterSkillViewController'

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
