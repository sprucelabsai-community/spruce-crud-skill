import { vcAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import {
    buildMasterListEntity,
    MasterSkillViewListEntity,
} from '../../../master/MasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockMasterListCard from '../../support/MockMasterListCard'
import { buildOrganizationTestEntity } from '../../support/test.utils'

@fake.login()
export default class MasterListCardTest extends AbstractCrudTest {
    private static entity: MasterSkillViewListEntity
    private static vc: MockMasterListCard

    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.setupWithEntity(this.buildLocationTestEntity())
    }

    @test()
    protected static async setsTheTitleBasedOnEntityTitle() {
        const model = this.views.render(this.vc)
        assert.isEqual(model.header?.title, this.entity.title)
    }

    @test()
    protected static async rendersAnActiveRecordCard() {
        vcAssert.assertIsActiveRecordCard(this.vc)
    }

    @test()
    @seed('locations', 1)
    protected static async rendersRowForLocationOnLoad() {
        await this.load()
        this.vc.assertRendersRow(this.fakedLocations[0].id)
    }

    @test()
    @seed('organizations', 1)
    protected static async rendersRowForOrganizationOnLoad() {
        this.setupWithEntity(buildOrganizationTestEntity())
        await this.load()
        this.vc.assertRendersRow(this.fakedOrganizations[0].id)
    }

    @test('can pass through paging options 1', 10, true)
    @test('can pass through paging options 2', 5, false)
    protected static async canPassThroughPaging(
        pageSize: number,
        shouldPageClientSide: boolean
    ) {
        this.setupWithEntity(
            buildMasterListEntity({
                id: generateId(),
                title: generateId(),
                load: {
                    fqen: 'list-organizations::v2020_12_25',
                    responseKey: 'organizations',
                    rowTransformer: () => ({ id: generateId(), cells: [] }),
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

    private static setupWithEntity(
        entity: MasterSkillViewListEntity<any, any>
    ) {
        this.entity = entity
        this.vc = this.views.Controller('crud.master-list-card', {
            entity: this.entity,
        }) as MockMasterListCard
    }

    private static async load() {
        await this.views.load(this.vc)
    }
}