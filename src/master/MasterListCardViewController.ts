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
    protected activeRecordCardVc: ActiveRecordCardViewController
    protected entity: MasterSkillViewListEntity

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

        this.entity = entity

        const { load } = entity
        const { fqen, ...activeOptions } = load

        this.activeRecordCardVc = this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                id: entity.id,
                header: {
                    title: entity.title,
                },
                eventName: fqen,
                ...activeOptions,
            })
        )
    }

    public setTarget(target?: Record<string, any>) {
        this.activeRecordCardVc.setTarget(target)
    }

    public setPayload(payload?: Record<string, any>) {
        this.activeRecordCardVc.setPayload(payload)
    }

    public async load(_options: SkillViewControllerLoadOptions) {
        await this.activeRecordCardVc.load()
    }

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