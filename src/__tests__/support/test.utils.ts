import { ListRow } from '@sprucelabs/heartwood-view-controllers'
import { generateId } from '@sprucelabs/test-utils'
import { buildMasterListEntity } from '../../master/MasterSkillViewController'

export function buildLocationTestEntity() {
    return buildMasterListEntity({
        id: generateId(),
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
