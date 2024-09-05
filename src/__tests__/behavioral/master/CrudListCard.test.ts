import {
    activeRecordCardAssert,
    interactor,
    listAssert,
    ListRow,
    SkillViewControllerId,
    vcAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { ClickAddHandler } from '../../../master/CrudListCardViewController'
import {
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
        this.setupWithEntity(this.buildLocationListEntity())
    }

    @test()
    protected static async setsTheTitleBasedOnEntityTitle() {
        const model = this.views.render(this.vc)
        assert.isEqual(model.header?.title, this.entity.pluralTitle)
    }

    @test()
    protected static async rendersAnActiveRecordCard() {
        activeRecordCardAssert.isActiveRecordCard(this.vc)
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
        await this.clickRowToggle(this.locationId)
        this.assertRowIsSelected(this.locationId)
        await this.clickRowToggle(this.fakedLocations[1].id)
        this.assertRowNotSelected(this.locationId)
    }

    private static assertRowNotSelected(id: string) {
        const value = this.getRowIsToggled(id)
        assert.isFalse(value, `Row ${id} should not be selected`)
    }

    private static assertRowIsSelected(id: string) {
        const value = this.getRowIsToggled(id)
        assert.isTrue(value)
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

    private static get listVc() {
        return this.vc.getListVc()
    }
}
