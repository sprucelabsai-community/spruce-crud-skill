import { SpruceSchemas } from '@sprucelabs/spruce-core-schemas'
import { eventFaker } from '@sprucelabs/spruce-test-fixtures'
import { generateId } from '@sprucelabs/test-utils'

export default class EventFaker {
    public async fakeListLocations(cb?: () => void) {
        await eventFaker.on('list-locations::v2020_12_25', () => {
            cb?.()
            return {
                locations: [],
            }
        })
    }
    public async fakeListInstalledSkills(cb?: () => ListSkill[] | void) {
        await eventFaker.on('list-installed-skills::v2020_12_25', () => {
            return {
                skills: cb?.() ?? [],
            }
        })
    }

    public async fakeGetOrganization() {
        await eventFaker.on('get-organization::v2020_12_25', () => {
            return {
                organization: {
                    id: generateId(),
                    name: generateId(),
                    slug: generateId(),
                    dateCreated: Date.now(),
                },
            }
        })
    }

    public async fakeCreateLocation(
        cb?: (targetAndPayload: CreateLocationTargetAndPayload) => void
    ) {
        await eventFaker.on(
            'create-location::v2020_12_25',
            (targetAndPayload) => {
                cb?.(targetAndPayload)
                return {
                    location: this.generateLocationValues(),
                }
            }
        )
    }

    public async fakeGetLocation(
        cb?: (targetAndPayload: GetLocationTargetAndPayload) => void
    ) {
        await eventFaker.on('get-location::v2020_12_25', (targetAndPayload) => {
            cb?.(targetAndPayload)
            return {
                location: this.generateLocationValues(),
            }
        })
    }

    private generateLocationValues() {
        return {
            id: generateId(),
            name: generateId(),
            dateCreated: Date.now(),
            organizationId: generateId(),
            slug: generateId(),
            address: {
                street1: generateId(),
                city: generateId(),
                province: generateId(),
                zip: generateId(),
                country: generateId(),
            },
        }
    }

    public async fakeListSkills(cb?: () => void | ListSkill[]) {
        await eventFaker.on('list-skills::v2020_12_25', () => {
            return {
                skills: cb?.() ?? [],
            }
        })
    }
}

export type ListSkill = SpruceSchemas.Mercury.v2020_12_25.ListSkillsSkill
export type GetLocationTargetAndPayload =
    SpruceSchemas.Mercury.v2020_12_25.GetLocationEmitTargetAndPayload
export type CreateLocationTargetAndPayload =
    SpruceSchemas.Mercury.v2020_12_25.CreateLocationEmitTargetAndPayload
