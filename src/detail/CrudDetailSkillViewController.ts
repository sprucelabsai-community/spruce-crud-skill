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
import { CrudListEntity } from '../index-module'
import CrudListCardViewController from '../master/CrudListCardViewController'
import CrudDetailFormCardViewController from './CrudDetailFormCardViewController'

export default class CrudDetailSkillViewController extends AbstractSkillViewController {
    protected detailsFormCardVc: CrudDetailFormCardViewController
    private router?: Router
    protected options: DetailSkillViewControllerOptions
    protected wasLoaded = false
    private relatedCardVcs: CrudListCardViewController[] = []

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

        for (const entity of entities) {
            for (const related of entity.relatedEntities ?? []) {
                const listCardVc = this.Controller('crud.list-card', {
                    entity: related,
                })

                this.relatedCardVcs.push(listCardVc)
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

    private validateEntities(entities: CrudDetailSkillViewEntity[]) {
        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: `You gotta supply at least one entity.`,
            })
        }

        entities.forEach((entity) => this.validateEntity(entity))
    }

    private validateEntity(entity: CrudDetailSkillViewEntity) {
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
        const { args, router } = options
        const { entity: entityId, action } = args

        this.assertValidAction(action)

        this.router = router
        const entity = this.findEntity(entityId)

        let values: Record<string, any> | undefined

        if (action === 'edit') {
            values = await this.loadValues(entity, args)
        }

        await this.loadDetailsFormCard(entity, values)

        this.wasLoaded = true

        this.triggerRender()
    }

    private async loadDetailsFormCard(
        entity: CrudDetailSkillViewEntity,
        values: Record<string, any> | undefined
    ) {
        await this.detailsFormCardVc.load(entity, values)
    }

    private async loadValues(
        entity: CrudDetailSkillViewEntity,
        args: CrudDetailSkillViewArgs
    ) {
        const { recordId } = assertOptions(args, ['recordId'])
        const { load } = entity
        const { buildTarget, fqen, responseKey } = load

        const target = await buildTarget(recordId)
        const client = await this.connectToApi()
        const [results] = await client.emitAndFlattenResponses(fqen, {
            //@ts-ignore
            target,
        })

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
                rightCards: this.relatedCardVcs.map((vc) => vc.render()),
            }),
        }
    }
}

export interface DetailSkillViewControllerOptions {
    entities: CrudDetailSkillViewEntity[]
    cancelDestination: SkillViewControllerId
}

export type DetailForm = Omit<FormCardViewControllerOptions<any>, 'id'>

export interface CrudDetailSkillViewEntity {
    id: string
    form: DetailForm
    load: {
        fqen: EventName
        responseKey: string
        buildTarget: (
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
