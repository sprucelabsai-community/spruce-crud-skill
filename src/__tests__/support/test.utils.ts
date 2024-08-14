import { generateId } from '@sprucelabs/test-utils'
import { MasterSkilLViewEntity } from '../../master/MasterSkillViewController'

export function buildEntity(): MasterSkilLViewEntity {
    return {
        id: generateId(),
        title: generateId(),
        loadEvent: 'list-locations::v2020_12_25',
    }
}
