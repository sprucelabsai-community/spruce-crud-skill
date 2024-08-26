import { ListRow } from '@sprucelabs/heartwood-view-controllers'
import { generateId, RecursivePartial } from '@sprucelabs/test-utils'
import {
    DetailForm,
    CrudDetailSkillViewEntity,
} from '../../detail/CrudDetailSkillViewController'
import {
    buildCrudMasterListEntity,
    CrudMasterSkillViewListEntity,
} from '../../master/CrudMasterSkillViewController'
import { detailFormOptions1 } from './detailFormOptions'

export function buildLocationTestEntity(id?: string) {
    return buildCrudMasterListEntity({
        id: id ?? generateId(),
        pluralTitle: generateId(),
        singularTitle: generateId(),
        list: {
            fqen: 'list-locations::v2020_12_25',
            responseKey: 'locations',
            rowTransformer: (location) =>
                ({
                    id: location.id,
                    cells: [
                        {
                            text: {
                                content: location.name,
                            },
                        },
                    ],
                }) as ListRow,
        },
    })
}

export function buildLocationTestPagingEntity(id?: string) {
    return buildCrudMasterListEntity({
        id: id ?? generateId(),
        pluralTitle: generateId(),
        singularTitle: generateId(),
        list: {
            fqen: 'list-locations::v2020_12_25',
            responseKey: 'locations',
            paging: {
                pageSize: 5,
                shouldPageClientSide: true,
            },
            rowTransformer: (location) =>
                ({
                    id: location.id,
                    cells: [
                        {
                            text: {
                                content: location.name,
                            },
                        },
                    ],
                }) as ListRow,
        },
    })
}

export function buildOrganizationTestEntity() {
    return buildCrudMasterListEntity({
        id: generateId(),
        pluralTitle: generateId(),
        singularTitle: generateId(),
        list: {
            fqen: 'list-organizations::v2020_12_25',
            responseKey: 'organizations',
            rowTransformer: (organization) =>
                ({
                    id: organization.id,
                    cells: [
                        {
                            text: {
                                content: organization.name,
                            },
                        },
                    ],
                }) as ListRow,
        },
    })
}

export function buildTestDetailEntity(
    id?: string,
    form?: DetailForm
): CrudDetailSkillViewEntity {
    return {
        id: id ?? generateId(),
        form: form ?? detailFormOptions1,
        load: {
            fqen: 'get-location::v2020_12_25',
            responseKey: 'location',
            buildTarget(recordId) {
                return {
                    locationId: recordId,
                }
            },
        },
    }
}

export function buildOrganizationsListTestEntity(
    options?: RecursivePartial<CrudMasterSkillViewListEntity>
) {
    return buildCrudMasterListEntity({
        id: generateId(),
        pluralTitle: generateId(),
        singularTitle: generateId(),
        ...options,
        list: {
            fqen: 'list-organizations::v2020_12_25',
            responseKey: 'organizations',
            //@ts-ignore
            rowTransformer: () => ({ id: generateId(), cells: [] }),
            ...options?.list,
        },
    }) as CrudMasterSkillViewListEntity<any>
}
