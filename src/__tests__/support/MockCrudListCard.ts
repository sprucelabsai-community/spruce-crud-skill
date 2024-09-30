import {
    activeRecordCardAssert,
    ActiveRecordPagingOptions,
    listAssert,
    MockActiveRecordCard,
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

    public assertRowSelected(locationId: string) {
        const vc = this.getListVc().getRowVc(locationId)
        assert.isTrue(
            vc.getValue('isSelected'),
            `Row ${locationId} is not selected and should be.`
        )
    }

    public assertRowNotSelected(locationId: string) {
        const vc = this.getListVc().getRowVc(locationId)
        assert.isFalse(
            vc.getValue('isSelected'),
            `Row ${locationId} is selected and should not be.`
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
        values?: Record<string, any>,
        detailEntity?: string
    ) {
        await super.load(options, values, detailEntity)

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

    public getListVcs() {
        return (this.activeRecordCardVc as MockActiveRecordCard).getListVcs()
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

    public assertRendersToggle(rowId: string) {
        listAssert.rowRendersToggle(this.getListVc(), rowId, 'isSelected')
    }

    public assertDoesNotRenderToggle(rowId: string) {
        listAssert.rowDoesNotRenderToggle(this.getListVc(), rowId)
    }

    public async search(term: string) {
        const formVc = this.getSearchFormVc()

        await formVc.setValue('search', term)
    }

    public getSearchFormVc() {
        const formVc = (
            this.activeRecordCardVc as MockActiveRecordCard
        ).getSearchFormVc()

        assert.isTruthy(
            formVc,
            `You have to enable search on the list card to use this method`
        )

        return formVc
    }
}
