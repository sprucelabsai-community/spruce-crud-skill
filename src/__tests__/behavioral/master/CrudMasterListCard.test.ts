import { activeRecordCardAssert } from '@sprucelabs/heartwood-view-controllers'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { test, assert } from '@sprucelabs/test-utils'
import { CrudMasterSkillViewListEntity } from '../../../master/CrudMasterSkillViewController'
import AbstractCrudTest from '../../support/AbstractCrudTest'
import MockMasterListCard from '../../support/MockMasterListCard'
import {
    buildOrganizationsListTestEntity,
    buildOrganizationTestEntity,
} from '../../support/test.utils'

@fake.login()
export default class MasterListCardTest extends AbstractCrudTest {
    private static entity: CrudMasterSkillViewListEntity
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
        this.setupWithOneEntity()
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
            buildOrganizationsListTestEntity({
                load: {
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

    private static setupWithOneEntity() {
        this.setupWithEntity(buildOrganizationTestEntity())
    }

    private static setupWithEntity(
        entity: CrudMasterSkillViewListEntity<any, any>
    ) {
        this.entity = entity
        this.vc = this.views.Controller('crud.master-list-card', {
            entity: this.entity,
        }) as MockMasterListCard
    }

    private static async load() {
        await this.views.load(this.vc)
    }

    private static assertRendersRow(id: string) {
        this.vc.assertRendersRow(id)
    }
}
