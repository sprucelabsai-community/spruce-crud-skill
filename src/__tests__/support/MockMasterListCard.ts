import {
    activeRecordCardAssert,
    ActiveRecordPagingOptions,
    listAssert,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assert } from '@sprucelabs/test-utils'
import MasterListCardViewController from '../../master/CrudMasterListCardViewController'

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
        listAssert.listRendersRow(this.getListVc(), id)
    }

    public getListVc() {
        return this.activeRecordCardVc.getListVc()
    }

    public assertTargetEquals(target?: Record<string, any>) {
        assert.isEqualDeep(
            this.activeRecordCardVc.getTarget(),
            target,
            'Your target does not match!'
        )
    }

    public assertPayloadEquals(payload?: Record<string, any>) {
        assert.isEqualDeep(
            this.activeRecordCardVc.getPayload(),
            payload,
            'Your payload does not match!'
        )
    }

    public getEntityId() {
        return this.entity.id
    }
}
