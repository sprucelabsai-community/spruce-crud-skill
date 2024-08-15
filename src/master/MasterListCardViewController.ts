import {
    AbstractViewController,
    ActiveRecordCardViewController,
    buildActiveRecordCard,
    Card,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { SkillEventContract } from '@sprucelabs/mercury-types'
import { assertOptions } from '@sprucelabs/schema'
import { MasterSkillViewListEntity } from './MasterSkillViewController'

export default class MasterListCardViewController extends AbstractViewController<Card> {
    private activeRecordCardVc: ActiveRecordCardViewController

    public constructor(
        options: ViewControllerOptions & MasterListCardViewControllerOptions
    ) {
        super(options)

        const { entity } = assertOptions(options, [
            'entity.id',
            'entity.title',
            'entity.load.fqen',
            'entity.load.responseKey',
            'entity.load.rowTransformer',
        ])

        this.activeRecordCardVc = this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                id: entity.id,
                header: {
                    title: entity.title,
                },
                eventName: 'list-locations::v2020_12_25',
                rowTransformer: () => ({ id: 'aoeu', cells: [] }),
                responseKey: 'locations',
            })
        )
    }

    public async load(_options: SkillViewControllerLoadOptions) {}

    public render(): Card {
        return this.activeRecordCardVc.render()
    }
}

export interface MasterListCardViewControllerOptions {
    entity: MasterSkillViewListEntity<SkillEventContract>
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
