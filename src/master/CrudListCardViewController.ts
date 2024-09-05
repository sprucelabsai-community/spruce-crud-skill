import {
    AbstractViewController,
    ActiveRecordCardViewController,
    buildActiveRecordCard,
    Card,
    CardFooter,
    ListCell,
    ListRow,
    Router,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions } from '@sprucelabs/schema'
import { CrudListEntity } from './CrudMasterSkillViewController'

export default class CrudListCardViewController extends AbstractViewController<Card> {
    protected activeRecordCardVc: ActiveRecordCardViewController
    protected entity: CrudListEntity<any, any>
    private onAddClickHandler?: ClickAddHandler
    private onClickRowHandler?: ClickRowHandler
    private router?: Router
    private isToggling = false
    private selectedRows: Record<string, boolean> = {}

    public constructor(
        options: ViewControllerOptions & CrudListCardViewControllerOptions
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
        this.onAddClickHandler = onAddClick
        this.onClickRowHandler = onClickRow
        this.activeRecordCardVc = this.ActiveRecordCard(entity)
    }

    private ActiveRecordCard(entity: CrudListEntity<any, any>) {
        const { list, pluralTitle, id, shouldRenderSearch } = entity
        const { fqen, ...activeOptions } = list

        return this.Controller(
            'active-record-card',
            buildActiveRecordCard({
                id,
                header: {
                    title: pluralTitle,
                },
                footer: this.renderFooter(),
                noResultsRow: {
                    cells: [
                        {
                            text: {
                                content: `No ${pluralTitle} Found`,
                            },
                        },
                    ],
                },
                eventName: fqen,
                shouldRenderSearch,
                ...activeOptions,
                rowTransformer: this.renderRow.bind(this),
            })
        )
    }

    private renderRow(record: Record<string, any>): ListRow {
        const row = this.entity.list.rowTransformer(record)

        row.onClick = () => this.handleClickRow(record)

        if (this.selectionMode !== 'none') {
            const id = record.id
            row.cells.push(this.renderToggleCell(id))
            row.columnWidths = ['fill']
        }

        console.log('rendering row', row, this.selectedRows)

        return row
    }

    private renderToggleCell(id: string): ListCell {
        return {
            toggleInput: {
                name: 'isSelected',
                value: this.selectedRows[id] ?? false,
                onChange: async (value) => {
                    if (this.isToggling) {
                        return
                    }

                    this.selectedRows[id] = value
                    if (this.selectionMode === 'single') {
                        this.isToggling = true
                        await this.deselectEverythingBut(id)
                        this.isToggling = false
                    }
                },
            },
        }
    }

    public async deselectEverythingBut(id: string) {
        const records = this.activeRecordCardVc.getRecords()
        const promises: Promise<void>[] = []

        for (const record of records) {
            if (record.id !== id) {
                promises.push(
                    this.activeRecordCardVc.setValue(
                        record.id,
                        'isSelected',
                        false
                    )
                )
            }
        }

        await Promise.all(promises)
    }

    private get selectionMode() {
        return this.entity.selectionMode ?? 'none'
    }

    private async handleClickRow(record: Record<string, any>) {
        await this.onClickRowHandler?.(this.entity.id, record)
        if (this.clickRowDestination) {
            await this.router?.redirect(this.clickRowDestination, {
                entity: this.entity.id,
                recordId: record.id,
                action: 'edit',
            })
        }
    }

    private get clickRowDestination() {
        return this.entity.list.clickRowDestination
    }

    private renderFooter(): CardFooter | null {
        if (!this.onAddClickHandler) {
            return null
        }
        return {
            buttons: [
                {
                    id: 'add',
                    label: `Add ${this.entity.singularTitle}`,
                    type: 'primary',
                    onClick: () => this.onAddClickHandler?.(this.entity.id),
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
        options: SkillViewControllerLoadOptions,
        values?: Record<string, any>
    ) {
        const { router } = options
        this.router = router

        const builtTarget = await this.entity.list.buildTarget?.(values)
        if (builtTarget) {
            this.activeRecordCardVc.setTarget(builtTarget)
        }
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

export interface CrudListCardViewControllerOptions {
    entity: CrudListEntity<any, any>
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
        'crud.list-card': CrudListCardViewControllerOptions
    }
}
