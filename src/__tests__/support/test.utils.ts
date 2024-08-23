import { ListRow } from '@sprucelabs/heartwood-view-controllers'
import { generateId } from '@sprucelabs/test-utils'
import {
    DetailForm,
    DetailSkillViewEntity,
} from '../../detail/DetailSkillViewController'
import { buildMasterListEntity } from '../../master/MasterSkillViewController'
import { detailFormOptions1 } from './detailFormOptions'

export function buildLocationTestEntity(id?: string) {
    return buildMasterListEntity({
        id: id ?? generateId(),
        title: generateId(),
        load: {
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
    return buildMasterListEntity({
        id: id ?? generateId(),
        title: generateId(),
        load: {
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
    return buildMasterListEntity({
        id: generateId(),
        title: generateId(),
        load: {
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

export function buildDetailEntity(
    id?: string,
    form?: DetailForm
): DetailSkillViewEntity {
    return {
        id: id ?? generateId(),
        form: form ?? detailFormOptions1,
    }
}
