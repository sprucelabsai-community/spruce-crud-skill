import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    ListRow,
    ActiveRecordPagingOptions,
    splitCardsIntoLayouts,
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
import MasterListCardViewController from './MasterListCardViewController'

export default class MasterSkillViewController extends AbstractSkillViewController {
    protected listCardsById: Record<string, MasterListCardViewController> = {}
    protected wasLoaded = false

    public constructor(
        options: ViewControllerOptions & MasterSkillViewControllerOptions
    ) {
        super(options)
        const { entities } = assertOptions(options, ['entities'])

        this.validateEntities(entities)
        this.buildCards(entities)
    }

    private validateEntities(entities: MasterSkillViewListEntity[]) {
        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: 'You must provide at least one entity!',
            })
        }
    }

    private buildCards(entities: MasterSkillViewListEntity[]) {
        for (const entity of entities) {
            this.listCardsById[entity.id] = this.Controller(
                'crud.master-list-card',
                {
                    entity,
                }
            )
        }
    }

    public async load(options: SkillViewControllerLoadOptions) {
        this.wasLoaded = true
        await Promise.all(this.listCardVcs.map((vc) => vc.load(options)))
    }

    protected get listCardVcs() {
        return Object.values(this.listCardsById)
    }

    public setTarget(listId: string, target?: Record<string, any>) {
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

    public setPayload(listId: string, payload?: Record<string, any>) {
        const listVc = this.getListById(listId)
        listVc.setPayload(payload)
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

export interface MasterSkillViewControllerOptions {
    entities: MasterSkillViewListEntity<any, any>[]
}

export interface MasterSkillViewListEntity<
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
    title: string
    load: {
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

type MasterListCardViewControllerBuilder = <
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
    options: MasterSkillViewListEntity<
        Contract,
        Fqen,
        IEventSignature,
        EmitSchema,
        ResponseSchema,
        Response,
        ResponseKey
    >
) => MasterSkillViewListEntity<
    Contract,
    Fqen,
    IEventSignature,
    EmitSchema,
    ResponseSchema,
    Response,
    ResponseKey
>

export const buildMasterListEntity: MasterListCardViewControllerBuilder = (
    options
) => {
    return options
}

export const buildMasterSkillViewOptions = (
    options: MasterSkillViewControllerOptions
) => {
    return options
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
