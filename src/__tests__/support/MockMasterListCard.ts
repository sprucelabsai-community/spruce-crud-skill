import { SkillViewControllerLoadOptions } from '@sprucelabs/heartwood-view-controllers'
import { assert } from '@sprucelabs/test-utils'
import { MasterListCardViewController } from '../../master/MasterListCardViewController'

export default class MockMasterListCard extends MasterListCardViewController {
    private wasLoaded = false
    private loadOptions?: SkillViewControllerLoadOptions

    public assertWasLoaded() {
        assert.isTrue(this.wasLoaded, 'List card was not loaded')
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await super.load(options)

        this.loadOptions = options
        this.wasLoaded = true
    }

    public assertWasLoadedWithOptions(options: SkillViewControllerLoadOptions) {
        assert.isEqualDeep(this.loadOptions, options)
    }
}
