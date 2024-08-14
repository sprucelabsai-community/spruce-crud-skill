import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { EventName } from '@sprucelabs/mercury-types'
import { assertOptions, SchemaError } from '@sprucelabs/schema'
import MasterListCardViewController from './MasterListCardViewController'

export default class MasterSkillViewController extends AbstractSkillViewController {
    protected listCardVcs: MasterListCardViewController[] = []

    public constructor(
        options: ViewControllerOptions & MasterSkillViewControllerOptions
    ) {
        super(options)
        const { entities } = assertOptions(options, ['entities'])

        this.validateEntities(entities)
        this.buildCards(entities)
    }

    private validateEntities(entities: MasterSkilLViewEntity[]) {
        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: 'You must provide at least one entity!',
            })
        }
    }

    private buildCards(entities: MasterSkilLViewEntity[]) {
        for (const entity of entities) {
            this.listCardVcs.push(
                this.Controller('crud.master-list-card', {
                    entity,
                })
            )
        }
    }

    public async load(options: SkillViewControllerLoadOptions) {
        await Promise.all(this.listCardVcs.map((vc) => vc.load(options)))
    }

    public render(): SkillView {
        return {
            controller: this,
            layouts: [
                {
                    cards: this.listCardVcs.map((vc) => vc.render()),
                },
            ],
        }
    }
}

export interface MasterSkillViewControllerOptions {
    entities: MasterSkilLViewEntity[]
}

export interface MasterSkilLViewEntity {
    id: string
    title: string
    loadEvent: EventName
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.master-skill-view': MasterSkillViewController
    }

    interface ViewControllerMap {
        'crud.master-skill-view': MasterSkillViewController
    }

    interface ViewControllerOptionsMap {
        'crud.master-skill-view': MasterSkillViewControllerOptions
    }
}
