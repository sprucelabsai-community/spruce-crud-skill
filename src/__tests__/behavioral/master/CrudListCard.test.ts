import {
    activeRecordCardAssert,
    ActiveRecordCardViewController,
    buttonAssert,
    interactor,
    ListRow,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { ClickAddHandler } from '../../../master/CrudListCardViewController'
import {
    CrudDestination,
    CrudListEntity,
    CrudListSelectionMode,
} from '../../../master/CrudMasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockCrudListCard from '../../support/MockCrudListCard'
import {
    buildOrganizationsListEntity,
    buildOrganizationListEntity,
} from '../../support/test.utils'

@fake.login()
export default class CrudListCardTest extends AbstractCrudTest {
    private static entity: CrudListEntity<any, any>
    private static vc: MockCrudListCard
    private static onAddClickHandler?: ClickAddHandler

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()

        ActiveRecordCardViewController.searchDebounceMs = 0
        this.setupWithEntity(this.buildLocationListEntity())
        delete this.onAddClickHandler
    }

    @test()
    protected static async setsTheTitleBasedOnEntityTitle() {
        const model = this.views.render(this.vc)
        assert.isEqual(model.header?.title, this.entity.pluralTitle)
    }

    @test()
    protected static async rendersAnActiveRecordCard() {
        activeRecordCardAssert.rendersAsActiveRecordCard(this.vc)
    }

    @test()
    @seed('locations', 1)
    protected static async rendersRowForLocationOnLoad() {
        await this.load()
        this.assertRendersRow(this.locationId)
    }

    @test()
    @seed('organizations', 1)
    protected static async rendersRowForOrganizationOnLoad() {
        this.setupWithOrgEntity()
        await this.load()
        this.assertRendersRow(this.fakedOrganizations[0].id)
    }

    @test('can pass through paging options 1', 10, true)
    @test('can pass through paging options 2', 5, false)
    protected static async canPassThroughPaging(
        pageSize: number,
        shouldPageClientSide: boolean
    ) {
        this.setupWithEntity(
            buildOrganizationsListEntity({
                list: {
                    paging: {
                        shouldPageClientSide,
                        pageSize,
                    },
                },
            })
        )

        this.vc.assertPagingOptionsEqual({
            shouldPageClientSide,
            pageSize,
        })
    }

    @test()
    protected static async passesThroughTitleSingularToAddButton() {
        const titleSingular = generateId()
        this.onAddClickHandler = () => {}

        this.setupWithEntity(
            buildOrganizationsListEntity({
                singularTitle: titleSingular,
            })
        )

        const model = this.views.render(this.vc)
        assert.doesInclude(model.footer?.buttons?.[0].label, titleSingular)
    }

    @test()
    protected static async buildTargetGetsValuesOnLoad() {
        this.setupWithOrgEntity()
        let passedValues: Record<string, any> | undefined

        const values = { [generateId()]: generateId() }

        this.entity.list.buildTarget = (values) => {
            passedValues = values
            return {}
        }

        await this.load(values)
        assert.isEqualDeep(passedValues, values)
    }

    @test()
    protected static async buildPayloadGetsValuesOnLoad() {
        this.setupWithOrgEntity()
        let passedValues: Record<string, any> | undefined

        const values = { [generateId()]: generateId() }

        this.entity.list.buildPayload = (values) => {
            passedValues = values
            return {}
        }

        await this.load(values)
        assert.isEqualDeep(passedValues, values)
    }

    @test()
    protected static async responseToBuildTargetSetsToActiveRecordCardTarget() {
        this.setupWithEntity(this.buildLocationListEntity())
        const target = { organizationId: generateId() }
        this.entity.list.buildTarget = async () => target
        await this.load()
        this.vc.assertTargetEquals(target)
    }

    @test()
    protected static async noResultsRowUsesPluralTitle() {
        await this.load()
        const row = this.getRowVc('no-results')
        const model = this.views.render(row)
        assert.isEqual(
            model.cells[0].text?.content,
            `No ${this.entity.pluralTitle} Found`
        )
    }

    @test('set row click destination redirects to crud.root', 'crud.root')
    @test('set row click destination redirects to crud.detail', 'crud.detail')
    @seed('locations', 1)
    protected static async canSetRowClickDestination(
        destination: SkillViewControllerId
    ) {
        const entity = this.buildLocationListEntity()
        entity.list.clickRowDestination = destination

        this.setupWithEntity(entity)
        await this.load()

        await vcAssert.assertActionRedirects({
            action: () => interactor.clickRow(this.listVc, this.locationId),
            router: this.views.getRouter(),
            destination: {
                id: destination,
                args: {
                    entity: entity.id,
                    recordId: this.locationId,
                    action: 'edit',
                },
            },
        })
    }

    @test()
    @seed('locations', 1)
    protected static async rendersToggelIfSelectionModeIsSingle() {
        await this.loadWithSelectionModel('single')
        this.vc.assertRendersToggle(this.locationId)
    }

    @test('does not render toggle if selection mode is not set', undefined)
    @test('does not render toggle if selection mode is none', 'none')
    @seed('locations', 1)
    protected static async doesNotRenderToggleIfSelectionModeIsNotSet(
        selectionMode?: CrudListSelectionMode
    ) {
        await this.loadWithSelectionModel(selectionMode)
        this.vc.assertDoesNotRenderToggle(this.locationId)
    }

    @test()
    @seed('locations', 1)
    protected static async rowsWithToggleSizeAsExpected() {
        await this.loadWithSelectionModel('single')
        this.assertColumnWidths(['fill'])
    }

    @test()
    @seed('locations', 1)
    protected static async doesNotSetColumnWidthsIfNoSelectionMode() {
        await this.load()
        this.assertColumnWidths()
    }

    @test()
    @seed('locations', 2)
    protected static async inSingleSelectionModeOnlyOneRowCanBeSelected() {
        await this.loadWithSelectionModel('single')
        await this.toggleFirstRow()
        this.assertRowIsSelected(this.locationId)
        await this.clickRowToggle(this.locationId2)
        this.assertRowIsNotSelected(this.locationId)
    }

    @test()
    @seed('locations', 2)
    protected static async canSelectMultipleRowsInMultiSelectionMode() {
        await this.loadWithSelectionModel('multiple')
        await this.toggleFirstRow()
        await this.toggleSecondRow()
        this.assertRowIsSelected(this.locationId)
    }

    @test()
    @seed('locations', 1)
    protected static async searchingDoesNotChangeSelectedRows() {
        await this.loadWithPagingAndSearch()
        await this.toggleFirstRow()
        await this.randomSearch()
        await this.clearSearch()

        this.assertRowIsSelected(this.locationId)
    }

    @test()
    @seed('locations', 1)
    protected static async doesNotReselectARowAfterDeselectAndSearch() {
        await this.loadWithPagingAndSearch()
        await this.toggleFirstRow()
        await this.toggleFirstRow()
        await this.randomSearch()
        await this.clearSearch()
        this.assertRowIsNotSelected(this.locationId)
    }

    @test()
    @seed('locations', 1)
    protected static async remembersSelectionWithSelectionModeMultipleAndSearchingAndClearing() {
        await this.loadWithPagingAndSearch('multiple')
        await this.toggleFirstRow()
        await this.randomSearch()
        await this.clearSearch()
        this.assertRowIsSelected(this.locationId)
    }

    @test()
    @seed('locations', 2)
    protected static async doesNotReselectAfterSearchWhenSelectionModeIsSingleAndRowIsDeselectedAutomatically() {
        await this.loadWithPagingAndSearch('single')
        await this.toggleFirstRow()
        await this.toggleSecondRow()
        await this.randomSearch()
        await this.clearSearch()
        this.assertRowIsNotSelected(this.locationId)
    }

    @test()
    protected static async canDropInAddDestination() {
        const destination: CrudDestination = { id: 'crud.detail' }
        await this.setupAndLoadWithDestination(destination)
        buttonAssert.cardRendersButton(this.vc, 'add')
    }

    @test('add redirects to destination one', 'crud.detail')
    @test('add redirects to destination two', 'crud.root')
    protected static async clickingAddRedirectsToAddDestination(
        destinationId: SkillViewControllerId
    ) {
        const destination: CrudDestination = { id: destinationId }
        await this.setupAndLoadWithDestination(destination)
        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.vc, 'add'),
            router: this.views.getRouter(),
            destination,
        })
    }

    @test()
    protected static async passesThroughExpectedArgsToAddRedirect() {
        await this.setupAndLoadWithDestination({ id: 'crud.detail' })
        await vcAssert.assertActionRedirects({
            action: () => interactor.clickButton(this.vc, 'add'),
            router: this.views.getRouter(),
            destination: {
                args: {
                    entity: this.entity.id,
                    action: 'create',
                },
            },
        })
    }

    @test()
    protected static async rendersExpectedPlaceholderIfSearchIsEnabled() {
        const entity = this.buildLocationListEntity()
        entity.shouldRenderSearch = true
        this.setupWithEntity(entity)
        await this.load()
        const expected = `Search ${entity.pluralTitle}...`
        const formVc = this.vc.getSearchFormVc()
        const field = formVc.getField('search')
        assert.isEqual(field.renderOptions.placeholder, expected)
    }

    private static async setupAndLoadWithDestination(
        destination: CrudDestination
    ) {
        const entity = this.buildLocationListEntity()
        entity.addDestination = destination
        this.setupWithEntity(entity)
        await this.load()
    }

    private static get locationId2(): string {
        return this.fakedLocations[1].id
    }

    private static async randomSearch() {
        await this.search(generateId())
    }

    private static async clearSearch() {
        await this.search('')
    }

    private static async loadWithPagingAndSearch(
        selectionMode?: CrudListSelectionMode
    ) {
        const entity = this.buildLocationListEntity()
        entity.selectionMode = selectionMode ?? 'single'
        entity.shouldRenderSearch = true
        entity.list.paging = {
            pageSize: 10,
            shouldPageClientSide: true,
        }

        this.setupWithEntity(entity)

        await this.load()
    }

    private static async search(term: string) {
        await this.vc.search(term)
        await this.wait(ActiveRecordCardViewController.searchDebounceMs)
    }

    private static assertRowIsNotSelected(id: string) {
        const value = this.getRowIsToggled(id)
        assert.isFalse(value, `Row ${id} should not be selected`)
    }

    private static assertRowIsSelected(id: string) {
        const value = this.getRowIsToggled(id)
        assert.isTrue(value, `Row ${id} should be selected`)
    }

    private static getRowIsToggled(id: string) {
        return this.getRowVc(id).getValue('isSelected')
    }

    private static async clickRowToggle(id: string) {
        await interactor.clickToggleInRow(this.listVc, id)
    }

    private static assertColumnWidths(columnWidths?: ListRow['columnWidths']) {
        const list = this.views.render(this.getRowVc(this.locationId))
        assert.isEqualDeep(list.columnWidths, columnWidths)
    }

    private static getRowVc(id: string) {
        return this.listVc.getRowVc(id)
    }

    private static async loadWithSelectionModel(
        selectionMode?: CrudListSelectionMode
    ) {
        const entity = this.buildLocationListEntity()
        entity.selectionMode = selectionMode
        this.setupWithEntity(entity)
        await this.load()
    }

    private static get locationId() {
        return this.fakedLocations[0].id
    }

    private static setupWithOrgEntity() {
        this.setupWithEntity(buildOrganizationListEntity())
    }

    private static async toggleFirstRow() {
        await this.clickRowToggle(this.locationId)
    }

    private static setupWithEntity(entity: CrudListEntity<any, any>) {
        this.entity = entity
        this.vc = this.views.Controller('crud.list-card', {
            entity: this.entity,
            onAddClick: this.onAddClickHandler,
        }) as MockCrudListCard
    }

    private static async load(values?: Record<string, any>) {
        const options = this.views.getRouter().buildLoadOptions()
        await this.vc.load(options, values)
    }

    private static assertRendersRow(id: string) {
        this.vc.assertRendersRow(id)
    }

    private static async toggleSecondRow() {
        await this.clickRowToggle(this.locationId2)
    }

    private static get listVc() {
        return this.entity.list.paging
            ? this.vc.getListVcs()[0]
            : this.vc.getListVc()
    }
}
