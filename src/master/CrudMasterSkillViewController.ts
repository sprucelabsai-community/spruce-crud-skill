import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    ListRow,
    ActiveRecordPagingOptions,
    splitCardsIntoLayouts,
    SkillViewControllerId,
    Router,
    removeUniversalViewOptions,
} from '@sprucelabs/heartwood-view-controllers'
import {
    EventContract,
    EventName,
    EventSignature,
    SkillEventContract,
} from '@sprucelabs/mercury-types'
import {
    assertOptions,
    Schema,
    SchemaError,
    SchemaValues,
} from '@sprucelabs/schema'
import MasterListCardViewController from './CrudMasterListCardViewController'

export default class CrudMasterSkillViewController extends AbstractSkillViewController {
    protected listCardsById: Record<string, MasterListCardViewController> = {}
    protected wasLoaded = false
    protected options: CrudMasterSkillViewControllerOptions
    private router?: Router
    protected addDestinationArgs: Record<string, Record<string, any>> = {}

    public constructor(
        options: ViewControllerOptions & CrudMasterSkillViewControllerOptions
    ) {
        super(options)
        const { entities } = assertOptions(options, ['entities'])

        this.options = removeUniversalViewOptions(options)
        this.validateEntities(entities)
        this.buildCards(entities)
    }

    private validateEntities(entities: CrudMasterSkillViewListEntity[]) {
        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: 'You must provide at least one entity!',
            })
        }
    }

    private buildCards(entities: CrudMasterSkillViewListEntity[]) {
        for (const entity of entities) {
            this.listCardsById[entity.id] = this.Controller(
                'crud.master-list-card',
                {
                    entity,
                    onClickRow: this.handleClickRow.bind(this),
                    onAddClick:
                        this.addDestination && this.handleAddClick.bind(this),
                }
            )
        }
    }

    private async handleAddClick(entityId: string) {
        if (this.addDestination) {
            await this.router?.redirect(this.addDestination, {
                action: 'create',
                entity: entityId,
                ...this.addDestinationArgs[entityId],
            })
        }
    }

    private async handleClickRow(
        entityId: string,
        record: Record<string, any>
    ) {
        if (this.clickRowDestination) {
            await this.router?.redirect(this.clickRowDestination, {
                action: 'edit',
                recordId: record.id,
                entity: entityId,
            })
        }
    }

    private get clickRowDestination() {
        return this.options.clickRowDestination
    }

    private get addDestination() {
        return this.options.addDestination
    }

    public async load(options: SkillViewControllerLoadOptions) {
        const { router } = options
        this.router = router
        this.wasLoaded = true
        await Promise.all(this.listCardVcs.map((vc) => vc.load(options)))
    }

    protected get listCardVcs() {
        return Object.values(this.listCardsById)
    }

    public setListTarget(listId: string, target?: Record<string, any>) {
        const listVc = this.getListById(listId)
        listVc.setTarget(target)
    }

    private getListById(listId: string) {
        const listVc = this.listCardsById[listId]
        if (!listVc) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                friendlyMessage: `Could not find list with id ${listId}`,
                parameters: ['listId'],
            })
        }
        return listVc
    }

    public setListPayload(listId: string, payload?: Record<string, any>) {
        const listVc = this.getListById(listId)
        listVc.setPayload(payload)
    }

    public setAddDestinationArgs(listId: string, args: Record<string, any>) {
        this.addDestinationArgs[listId] = args
    }

    public render(): SkillView {
        return {
            controller: this,
            layouts: splitCardsIntoLayouts(
                this.listCardVcs.map((vc) => vc.render()),
                3
            ),
        }
    }
}

export interface CrudMasterSkillViewControllerOptions {
    addDestination?: SkillViewControllerId
    clickRowDestination?: SkillViewControllerId
    entities: CrudMasterSkillViewListEntity<any, any>[]
}

export interface CrudMasterSkillViewListEntity<
    Contract extends EventContract = SkillEventContract,
    Fqen extends EventName<Contract> = EventName<Contract>,
    IEventSignature extends EventSignature = Contract['eventSignatures'][Fqen],
    EmitSchema extends
        Schema = IEventSignature['emitPayloadSchema'] extends Schema
        ? IEventSignature['emitPayloadSchema']
        : never,
    ResponseSchema extends
        Schema = IEventSignature['responsePayloadSchema'] extends Schema
        ? IEventSignature['responsePayloadSchema']
        : never,
    Response extends
        SchemaValues<ResponseSchema> = SchemaValues<ResponseSchema>,
    ResponseKey extends keyof Response = keyof Response,
> {
    id: string
    pluralTitle: string
    singularTitle: string
    list: {
        fqen: Fqen
        responseKey: ResponseKey
        rowTransformer: (entity: Response[ResponseKey][number]) => ListRow
        //@ts-ignore
        payload?: SchemaValues<EmitSchema>['payload']
        /** @ts-ignore */
        target?: SchemaValues<EmitSchema>['target']
        paging?: ActiveRecordPagingOptions
    }
}

type CrudMasterListCardViewControllerBuilder = <
    Contract extends EventContract = SkillEventContract,
    Fqen extends EventName<Contract> = EventName<Contract>,
    IEventSignature extends EventSignature = Contract['eventSignatures'][Fqen],
    EmitSchema extends
        Schema = IEventSignature['emitPayloadSchema'] extends Schema
        ? IEventSignature['emitPayloadSchema']
        : never,
    ResponseSchema extends
        Schema = IEventSignature['responsePayloadSchema'] extends Schema
        ? IEventSignature['responsePayloadSchema']
        : never,
    Response extends
        SchemaValues<ResponseSchema> = SchemaValues<ResponseSchema>,
    ResponseKey extends keyof Response = keyof Response,
>(
    options: CrudMasterSkillViewListEntity<
        Contract,
        Fqen,
        IEventSignature,
        EmitSchema,
        ResponseSchema,
        Response,
        ResponseKey
    >
) => CrudMasterSkillViewListEntity<
    Contract,
    Fqen,
    IEventSignature,
    EmitSchema,
    ResponseSchema,
    Response,
    ResponseKey
>

export const buildCrudMasterListEntity: CrudMasterListCardViewControllerBuilder =
    (options) => {
        return options
    }

export const buildCrudMasterSkillViewOptions = (
    options: CrudMasterSkillViewControllerOptions
) => {
    return options
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.master-skill-view': CrudMasterSkillViewController
    }

    interface ViewControllerMap {
        'crud.master-skill-view': CrudMasterSkillViewController
    }

    interface ViewControllerOptionsMap {
        'crud.master-skill-view': CrudMasterSkillViewControllerOptions
    }
}
