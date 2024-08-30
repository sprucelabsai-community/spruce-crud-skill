import { SkillEventContract } from '@sprucelabs/mercury-types'
import { CrudListEntity } from '../master/CrudMasterSkillViewController'

export const locationListOptions: CrudListEntity<
    SkillEventContract,
    'list-locations::v2020_12_25'
>['list'] = {
    fqen: 'list-locations::v2020_12_25',
    responseKey: 'locations',
    payload: {
        shouldOnlyShowWhereIAmEmployed: true,
    },
    paging: {
        pageSize: 5,
        shouldPageClientSide: true,
    },
    rowTransformer: (location) => ({
        id: location.id,
        cells: [
            {
                text: {
                    content: location.name,
                },
            },
        ],
    }),
}
