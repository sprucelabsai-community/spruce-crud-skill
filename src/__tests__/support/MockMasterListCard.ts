import {
    activeRecordCardAssert,
    listAssert,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { ActiveRecordPagingOptions } from '@sprucelabs/heartwood-view-controllers/build/builders/buildActiveRecordCard'
import { assert } from '@sprucelabs/test-utils'
import MasterListCardViewController from '../../master/MasterListCardViewController'

export default class MockMasterListCard extends MasterListCardViewController {
    private wasLoaded = false
    private loadOptions?: SkillViewControllerLoadOptions

    public assertWasLoaded() {
        assert.isTrue(this.wasLoaded, 'List card was not loaded')
    }

    public assertPagingOptionsEqual(options: ActiveRecordPagingOptions) {
        activeRecordCardAssert.assertPagingOptionsEqual(
            this.activeRecordCardVc,
            options
        )
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await super.load(options)

        this.loadOptions = options
        this.wasLoaded = true
    }

    public assertWasLoadedWithOptions(options: SkillViewControllerLoadOptions) {
        assert.isEqualDeep(this.loadOptions, options)
    }

    public assertRendersRow(id: string) {
        listAssert.listRendersRow(this.activeRecordCardVc.getListVc(), id)
    }
}
