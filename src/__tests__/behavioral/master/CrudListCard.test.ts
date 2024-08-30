import { activeRecordCardAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import { ClickAddHandler } from '../../../master/CrudListCardViewController'
import { CrudListEntity } from '../../../master/CrudMasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockCrudListCard from '../../support/MockCrudListCard'
import {
    buildOrganizationsListEntity,
    buildOrganizationTestEntity,
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
        const id = this.fakedLocations[0].id
        this.assertRendersRow(id)
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
        this.entity.list.buildTarget = () => target
        await this.load()
        this.vc.assertTargetEquals(target)
    }

    private static setupWithOrgEntity() {
        this.setupWithEntity(buildOrganizationTestEntity())
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
}
