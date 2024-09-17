import {
    AbstractSkillViewController,
    buildSkillViewLayout,
    removeUniversalViewOptions,
    Router,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { EventName } from '@sprucelabs/mercury-types'
import { assertOptions, SchemaError } from '@sprucelabs/schema'
import { FormCardViewControllerOptions } from '@sprucelabs/spruce-form-utils'
import SpruceError from '../errors/SpruceError'
import CrudListCardViewController from '../master/CrudListCardViewController'
import { CrudListEntity } from '../master/CrudMasterSkillViewController'
import CrudDetailFormCardViewController from './CrudDetailFormCardViewController'

export default class CrudDetailSkillViewController extends AbstractSkillViewController {
    protected detailsFormCardVc: CrudDetailFormCardViewController
    private router?: Router
    protected options: DetailSkillViewControllerOptions
    protected wasLoaded = false
    protected relatedEntityVcsByEntityId: Record<
        string,
        CrudListCardViewController[]
    > = {}
    private entityId?: string

    public constructor(
        options: ViewControllerOptions & DetailSkillViewControllerOptions
    ) {
        super(options)
        const { entities } = assertOptions(options, [
            'entities',
            'cancelDestination',
        ])

        this.validateEntities(entities)

        this.options = removeUniversalViewOptions(options)
        this.detailsFormCardVc = this.DetailFormCardVc()

        this.setupRelationshipCards()
    }

    private setupRelationshipCards() {
        for (const entity of this.options.entities) {
            for (const related of entity.relatedEntities ?? []) {
                const listCardVc = this.Controller('crud.list-card', {
                    entity: related,
                    currentSkillViewId: 'aoeu',
                })

                if (!this.relatedEntityVcsByEntityId[entity.id]) {
                    this.relatedEntityVcsByEntityId[entity.id] = []
                }

                this.relatedEntityVcsByEntityId[entity.id].push(listCardVc)
            }
        }
    }

    private DetailFormCardVc(): CrudDetailFormCardViewController {
        return this.Controller('crud.detail-form-card', {
            onCancel: this.handleClickCancel.bind(this),
            onSubmit: this.handleSubmitDetailForm.bind(this),
        })
    }

    private async handleSubmitDetailForm() {
        const client = await this.connectToApi()
        await client.emitAndFlattenResponses('create-location::v2020_12_25', {
            target: {
                organizationId: 'aoeu',
            },
            payload: {
                name: 'aoeu',
                address: {
                    street1: 'aoeu',
                    city: 'aoeu',
                    province: 'aoeu',
                    zip: 'aoeu',
                    country: 'aoeu',
                },
            },
        })
    }

    private validateEntities(entities: CrudDetailEntity[]) {
        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: `You gotta supply at least one entity.`,
            })
        }

        entities.forEach((entity) => this.validateEntity(entity))
    }

    private validateEntity(entity: CrudDetailEntity) {
        assertOptions({ entity }, [
            'entity.id',
            'entity.form',
            'entity.load',
            'entity.load.fqen',
            'entity.load.responseKey',
            'entity.load.buildTarget',
        ])
    }

    private async handleClickCancel() {
        await this.router?.redirect(this.cancelDestination, {})
    }

    private get cancelDestination() {
        return this.options.cancelDestination
    }

    public async load(
        options: SkillViewControllerLoadOptions<CrudDetailSkillViewArgs>
    ) {
        const { args, router, ...restOfOptions } = options
        const { entity: entityId, action } = args

        this.assertValidAction(action)

        this.router = router
        this.entityId = entityId

        const entity = this.findEntity(this.entityId)

        let values: Record<string, any> | undefined

        if (action === 'edit') {
            values = await this.loadValues(entity, args)
        }

        await this.loadDetailsFormCard(entity, values)
        await this.loadRelatedListCards(
            { ...restOfOptions, router, args: {} },
            values
        )

        this.wasLoaded = true

        this.triggerRender()
    }

    private async loadRelatedListCards(
        relatedOptions: SkillViewControllerLoadOptions,
        values: Record<string, any> | undefined
    ) {
        const relatedVcs = this.relatedEntityVcsByEntityId[this.entityId!] ?? []
        for (const relatedCardVc of relatedVcs) {
            await relatedCardVc?.load(relatedOptions, values)
        }
    }

    private async loadDetailsFormCard(
        entity: CrudDetailEntity,
        values: Record<string, any> | undefined
    ) {
        await this.detailsFormCardVc.load(entity, values)
    }

    private async loadValues(
        entity: CrudDetailEntity,
        args: CrudDetailSkillViewArgs
    ) {
        const { recordId } = assertOptions(args, ['recordId'])
        const { load } = entity
        const { buildTarget, fqen, responseKey } = load

        const target = await buildTarget?.(recordId)
        const payload = await load.buildPayload?.(recordId)
        const client = await this.connectToApi()
        const targetAndPayload: Record<string, any> = {}

        if (target) {
            targetAndPayload.target = target
        }

        if (payload) {
            targetAndPayload.payload = payload
        }

        const [results] = await client.emitAndFlattenResponses(
            fqen,
            targetAndPayload as any
        )

        return results[responseKey]
    }

    private assertValidAction(action: string) {
        if (['create', 'edit'].indexOf(action) === -1) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['action'],
                friendlyMessage: `Invalid action!`,
            })
        }
    }

    private get entities() {
        return this.options.entities
    }

    private findEntity(entityId: string) {
        const entity = this.entities.find((e) => e.id === entityId)

        if (!entity) {
            throw new SpruceError({
                code: 'INVALID_ENTITY_ID',
                entityId,
            })
        }
        return entity
    }

    public render(): SkillView {
        return {
            controller: this,
            ...buildSkillViewLayout('big-left', {
                leftCards: [this.detailsFormCardVc.render()],
                rightCards: this.relatedEntityVcsByEntityId[
                    this.entityId ?? ''
                ]?.map((vc) => vc.render()),
            }),
        }
    }
}

export interface DetailSkillViewControllerOptions {
    entities: CrudDetailEntity[]
    cancelDestination: SkillViewControllerId
}

export type DetailForm = Omit<FormCardViewControllerOptions<any>, 'id'>

export interface CrudDetailEntity {
    id: string
    form: DetailForm
    load: {
        fqen: EventName
        responseKey: string
        buildTarget?: (
            recordId: string
        ) => Record<string, any> | Promise<Record<string, any>>
        buildPayload?: (
            recordId: string
        ) => Record<string, any> | Promise<Record<string, any>>
    }
    renderTitle?: (record?: any) => string
    relatedEntities?: CrudListEntity<any, any>[]
}

export type CrudDetailLoadAction = 'edit' | 'create'

export interface CrudDetailSkillViewArgs {
    entity: string
    action: CrudDetailLoadAction
    recordId?: string
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.detail-skill-view': CrudDetailSkillViewController
    }

    interface ViewControllerMap {
        'crud.detail-skill-view': CrudDetailSkillViewController
    }

    interface ViewControllerOptionsMap {
        'crud.detail-skill-view': DetailSkillViewControllerOptions
    }
}
