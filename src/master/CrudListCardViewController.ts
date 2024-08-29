import {
    AbstractViewController,
    ActiveRecordCardViewController,
    buildActiveRecordCard,
    Card,
    CardFooter,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { SkillEventContract } from '@sprucelabs/mercury-types'
import { assertOptions } from '@sprucelabs/schema'
import { CrudListEntity } from './CrudMasterSkillViewController'

export default class CrudListCardViewController extends AbstractViewController<Card> {
    protected activeRecordCardVc: ActiveRecordCardViewController
    protected entity: CrudListEntity
    private onAddClick?: ClickAddHandler

    public constructor(
        options: ViewControllerOptions & MasterListCardViewControllerOptions
    ) {
        super(options)

        const { entity, onClickRow, onAddClick } = assertOptions(options, [
            'entity.id',
            'entity.pluralTitle',
            'entity.singularTitle',
            'entity.list.fqen',
            'entity.list.responseKey',
            'entity.list.rowTransformer',
        ])

        this.entity = entity
        this.onAddClick = onAddClick
        this.activeRecordCardVc = this.ActiveRecordCard(entity, onClickRow)
    }

    private ActiveRecordCard(
        entity: CrudListEntity,
        onClickRow?: ClickRowHandler
    ) {
        const { list: load } = entity
        const { fqen, rowTransformer, ...activeOptions } = load

        return this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                id: entity.id,
                header: {
                    title: entity.pluralTitle,
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
                    label: `Add ${this.entity.singularTitle}`,
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

    public async load(
        _options: SkillViewControllerLoadOptions,
        _values?: Record<string, any>
    ) {
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

export type ClickAddHandler = (entityId: string) => void | Promise<void>

export interface MasterListCardViewControllerOptions {
    entity: CrudListEntity<SkillEventContract>
    onClickRow?: ClickRowHandler
    onAddClick?: ClickAddHandler
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.list-card': CrudListCardViewController
    }

    interface ViewControllerMap {
        'crud.list-card': CrudListCardViewController
    }

    interface ViewControllerOptionsMap {
        'crud.list-card': MasterListCardViewControllerOptions
    }
}
