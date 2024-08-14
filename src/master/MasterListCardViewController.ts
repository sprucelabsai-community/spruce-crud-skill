import {
    AbstractViewController,
    Card,
    CardViewController,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { MasterSkilLViewEntity } from './MasterSkillViewController'

export default class MasterListCardViewController extends AbstractViewController<Card> {
    private cardVc: CardViewController

    public constructor(
        options: ViewControllerOptions & MasterListCardViewControllerOptions
    ) {
        super(options)

        const { entity } = assertOptions(options, [
            'entity.id',
            'entity.title',
            'entity.loadEvent',
        ])

        this.cardVc = this.Controller('card', {
            id: entity.id,
            header: {
                title: entity.title,
            },
        })
    }

    public async load(_options: SkillViewControllerLoadOptions) {}

    public render(): Card {
        return this.cardVc.render()
    }
}

export interface MasterListCardViewControllerOptions {
    entity: MasterSkilLViewEntity
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.master-list-card': MasterListCardViewController
    }

    interface ViewControllerMap {
        'crud.master-list-card': MasterListCardViewController
    }

    interface ViewControllerOptionsMap {
        'crud.master-list-card': MasterListCardViewControllerOptions
    }
}
