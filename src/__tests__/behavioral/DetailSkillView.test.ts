import { buildForm } from '@sprucelabs/heartwood-view-controllers'
import {
    locationSchema,
    organizationSchema,
} from '@sprucelabs/spruce-core-schemas'
import { fake, seed } from '@sprucelabs/spruce-test-fixtures'
import { RecursivePartial, test } from '@sprucelabs/test-utils'
import { CrudDetailSkillViewEntity } from '../../detail/CrudDetailSkillViewController'
import { crudAssert } from '../../index-module'
import DetailSkillViewController from '../../skillViewControllers/Detail.svc'
import AbstractCrudTest from '../support/AbstractCrudTest'

@fake.login()
export default class DetailSkillViewTest extends AbstractCrudTest {
    private static vc: DetailSkillViewController

    @seed('locations', 1)
    protected static async beforeEach(): Promise<void> {
        await super.beforeEach()
        crudAssert.beforeEach(this.views)
        await this.eventFaker.fakeListInstalledSkills()
        this.vc = this.views.Controller('crud.detail', {})
    }

    @test()
    protected static async rendersDetailSkillView() {
        crudAssert.skillViewRendersDetailView(this.vc, {
            cancelDestination: 'crud.root',
            entities: [
                this.buildExpectedLocationsEntity(),
                this.buildExpectedOrganizationsEntity(),
            ],
        })
    }

    @test()
    protected static async loadsDetailSkillView() {
        await crudAssert.skillViewLoadsDetailView(this.vc)
    }

    @test()
    protected static async buildsLocationTarget() {
        const locationId = this.fakedLocations[0].id
        await crudAssert.detailLoadTargetEquals({
            skillView: this.vc,
            recordId: locationId,
            entityId: 'locations',
            expectedTarget: {
                locationId,
            },
        })
    }

    @test()
    protected static async buildsOrganizationTarget() {
        const organizationId = this.fakedOrganizations[0].id
        await crudAssert.detailLoadTargetEquals({
            skillView: this.vc,
            recordId: organizationId,
            entityId: 'organizations',
            expectedTarget: {
                organizationId,
            },
        })
    }

    @test()
    protected static async organizationEntityRendersRelatedLocations() {
        await crudAssert.detailRendersRelatedEntity({
            skillView: this.vc,
            entityId: 'organizations',
            relatedId: 'locations',
            recordId: this.fakedOrganizations[0].id,
            expectedOptions: {
                pluralTitle: 'Locations',
                singularTitle: 'Location',
                list: {
                    fqen: 'list-locations::v2020_12_25',
                    responseKey: 'locations',
                    payload: undefined,
                    target: {
                        organizationId: this.fakedOrganizations[0].id,
                    } as any,
                    paging: {
                        pageSize: 5,
                        shouldPageClientSide: true,
                    },
                },
            },
        })
    }

    @test()
    protected static async organizationEntityRendersInstalledSkills() {
        await crudAssert.detailRendersRelatedEntity({
            skillView: this.vc,
            entityId: 'organizations',
            relatedId: 'skills',
            recordId: this.fakedOrganizations[0].id,
            expectedOptions: {
                pluralTitle: 'Skills',
                singularTitle: 'Skill',
                list: {
                    fqen: 'list-installed-skills::v2020_12_25',
                    responseKey: 'skills',
                    target: {
                        organizationId: this.fakedOrganizations[0].id,
                    } as any,
                    paging: {
                        pageSize: 5,
                        shouldPageClientSide: true,
                    },
                },
            },
        })
    }

    private static buildExpectedLocationsEntity(): RecursivePartial<CrudDetailSkillViewEntity> {
        return {
            id: 'locations',
            form: buildForm({
                id: 'locationsForm',
                schema: locationSchema,
                sections: [
                    {
                        fields: ['name', 'timezone', 'address'],
                    },
                ],
            }),
            load: {
                fqen: 'get-location::v2020_12_25',
                responseKey: 'location',
            },
        }
    }

    private static buildExpectedOrganizationsEntity(): RecursivePartial<CrudDetailSkillViewEntity> {
        return {
            id: 'organizations',
            form: buildForm({
                id: 'organizationsForm',
                schema: organizationSchema,
                sections: [
                    {
                        fields: ['name', 'address'],
                    },
                ],
            }),
            load: {
                fqen: 'get-organization::v2020_12_25',
                responseKey: 'organization',
            },
        }
    }
}
