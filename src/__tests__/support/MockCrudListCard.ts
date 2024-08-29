import {
    activeRecordCardAssert,
    ActiveRecordPagingOptions,
    listAssert,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assert } from '@sprucelabs/test-utils'
import CrudListCardViewController from '../../master/CrudListCardViewController'

export default class MockCrudListCard extends CrudListCardViewController {
    private wasLoaded = false
    private loadOptions?: SkillViewControllerLoadOptions
    private loadValues?: Record<string, any>

    public assertWasLoaded() {
        assert.isTrue(
            this.wasLoaded,
            'List card was not loaded and it should have been'
        )
    }

    public assertWasNotLoaded() {
        assert.isFalse(
            this.wasLoaded,
            'List card was loaded and it should not have been'
        )
    }

    public assertPagingOptionsEqual(options: ActiveRecordPagingOptions) {
        activeRecordCardAssert.assertPagingOptionsEqual(
            this.activeRecordCardVc,
            options
        )
    }

    public async load(
        options: SkillViewControllerLoadOptions,
        values?: Record<string, any>
    ) {
        await super.load(options, values)

        this.loadOptions = options
        this.wasLoaded = true
        this.loadValues = values
    }

    public assertWasLoadedWithOptions(
        options: SkillViewControllerLoadOptions,
        values?: Record<string, any>
    ) {
        assert.isEqualDeep(
            this.loadOptions,
            options,
            `Your load options do not match!`
        )
        if (values) {
            assert.isEqualDeep(
                this.loadValues,
                values,
                `Your load values do not match!`
            )
        }
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
