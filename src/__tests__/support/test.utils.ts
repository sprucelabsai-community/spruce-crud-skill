import { ListRow } from '@sprucelabs/heartwood-view-controllers'
import { generateId, RecursivePartial } from '@sprucelabs/test-utils'
import {
    DetailForm,
    CrudDetailEntity,
} from '../../detail/CrudDetailSkillViewController'
import {
    buildCrudListEntity,
    CrudListEntity,
} from '../../master/CrudMasterSkillViewController'
import { detailFormOptions1 } from './detailFormOptions'

export function buildLocationListEntity(id?: string) {
    return buildCrudListEntity({
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

export function buildLocationListPagingEntity(id?: string) {
    return buildCrudListEntity({
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
    return buildCrudListEntity({
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

export function buildLocationDetailEntity(
    id?: string,
    form?: DetailForm
): CrudDetailEntity {
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

export function buildOrganizationsListEntity(
    options?: RecursivePartial<CrudListEntity>
) {
    return buildCrudListEntity({
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
    }) as CrudListEntity<any>
}
