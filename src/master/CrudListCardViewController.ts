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
        this.activeRecordCardVc = this.ActiveRecordCard()
    }

    public getDoesRequireDetailRecordId() {
        return !!this.entity.doesRequireDetailRecord
    }

    private ActiveRecordCard() {
        const { list, pluralTitle, id, shouldRenderSearch } = this.entity
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
                searchPlaceholder: `Search ${pluralTitle}...`,
                ...activeOptions,
                rowTransformer: this.renderRow.bind(this),
            })
        )
    }

    private renderRow(record: Record<string, any>): ListRow {
        const row = this.entity.list.rowTransformer(record)

        row.onClick = () => this.handleClickRow(record)

        if (this.selectionMode !== 'none') {
            row.cells.push(this.renderToggleCell(record))
            row.columnWidths = ['fill']
        }

        return row
    }

    private renderToggleCell(record: Record<string, any>): ListCell {
        const { id } = record
        return {
            toggleInput: {
                name: 'isSelected',
                value: this.isRowSelected(record),
                onChange: async (value) => {
                    this.selectedRows[id] = value
                    const shouldDeselectEverythingElse =
                        !this.isToggling && this.selectionMode === 'single'

                    if (shouldDeselectEverythingElse) {
                        this.isToggling = true
                        await this.deselectEverythingBut(id)
                        this.isToggling = false
                    }
                },
            },
        }
    }

    private isRowSelected(record: Record<string, any>): boolean {
        if (this.entity.list.isRowSelected) {
            return this.entity.list.isRowSelected(record)
        }
        return this.selectedRows[record.id] ?? false
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
        if (!this.onAddClickHandler && !this.entity.addDestination) {
            return null
        }
        return {
            buttons: [
                {
                    id: 'add',
                    label: `Add ${this.entity.singularTitle}`,
                    type: 'primary',
                    onClick: this.handleClickAdd.bind(this),
                },
            ],
        }
    }

    private async handleClickAdd() {
        const { id, addDestination } = this.entity
        await this.onAddClickHandler?.(id)
        if (addDestination) {
            await this.router?.redirect(addDestination.id, {
                action: 'create',
                entity: id,
            })
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
        values?: Record<string, any>,
        detailEntityId?: string
    ) {
        const { router } = options
        this.router = router

        if (!values && this.getDoesRequireDetailRecordId()) {
            this.activeRecordCardVc.setFooter(null)
            this.activeRecordCardVc.setHeaderSubtitle(
                `You have to save before you can add a ${this.entity.singularTitle}!`
            )
            return
        }

        const builtTarget = await this.entity.list.buildTarget?.(
            detailEntityId,
            values
        )
        if (builtTarget) {
            this.activeRecordCardVc.setTarget(builtTarget)
        }

        const builtPayload = await this.entity.list.buildPayload?.(
            detailEntityId,
            values
        )

        if (builtPayload) {
            this.activeRecordCardVc.setPayload(builtPayload)
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
