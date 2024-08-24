import {
    AbstractViewController,
    ActiveRecordCardViewController,
    buildActiveRecordCard,
    Card,
    CardFooter,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { SkillEventContract } from '@sprucelabs/mercury-types'
import { assertOptions } from '@sprucelabs/schema'
import { CrudMasterSkillViewListEntity } from './CrudMasterSkillViewController'

export default class MasterListCardViewController extends AbstractViewController<Card> {
    protected activeRecordCardVc: ActiveRecordCardViewController
    protected entity: CrudMasterSkillViewListEntity
    private onAddClick?: ClickAddHandler

    public constructor(
        options: ViewControllerOptions & MasterListCardViewControllerOptions
    ) {
        super(options)

        const { entity, onClickRow, onAddClick } = assertOptions(options, [
            'entity.id',
            'entity.title',
            'entity.load.fqen',
            'entity.load.responseKey',
            'entity.load.rowTransformer',
        ])

        this.entity = entity
        this.onAddClick = onAddClick
        this.activeRecordCardVc = this.ActiveRecordCard(entity, onClickRow)
    }

    private ActiveRecordCard(
        entity: CrudMasterSkillViewListEntity,
        onClickRow?: ClickRowHandler
    ) {
        const { load } = entity
        const { fqen, rowTransformer, ...activeOptions } = load

        return this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                id: entity.id,
                header: {
                    title: entity.title,
                },
                footer: this.renderFooter(),
                eventName: fqen,
                rowTransformer: (record) => {
                    const row = rowTransformer(record)
                    row.onClick = () => onClickRow?.(entity.id, record)
                    return row
                },
                ...activeOptions,
            })
        )
    }

    private renderFooter(): CardFooter | null {
        if (!this.onAddClick) {
            return null
        }
        return {
            buttons: [
                {
                    id: 'add',
                    label: 'Add',
                    type: 'primary',
                    onClick: () => this.onAddClick?.(this.entity.id),
                },
            ],
        }
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

type ClickRowHandler = (
    entityId: string,
    record: Record<string, any>
) => void | Promise<void>

type ClickAddHandler = (entityId: string) => void | Promise<void>

export interface MasterListCardViewControllerOptions {
    entity: CrudMasterSkillViewListEntity<SkillEventContract>
    onClickRow?: ClickRowHandler
    onAddClick?: ClickAddHandler
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
