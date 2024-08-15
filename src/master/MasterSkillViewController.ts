import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
    SkillViewControllerLoadOptions,
    ListRow,
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
    protected listCardVcs: MasterListCardViewController[] = []

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
    entities: MasterSkillViewListEntity<SkillEventContract>[]
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
    }
}

type MasterListCardViewControllerBuilder<Contract extends EventContract> = <
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

export const buildMasterListEntity: MasterListCardViewControllerBuilder<
    SkillEventContract
> = (options) => {
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
