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
import { assertOptions, SchemaError } from '@sprucelabs/schema'
import { FormCardViewControllerOptions } from '@sprucelabs/spruce-form-utils'
import SpruceError from '../errors/SpruceError'
import CrudDetailFormCardViewController from './CrudDetailFormCardViewController'

export default class CrudDetailSkillViewController extends AbstractSkillViewController {
    protected detailsFormCardVc: CrudDetailFormCardViewController
    private router?: Router
    protected options: DetailSkillViewControllerOptions
    protected wasLoaded = false

    public constructor(
        options: ViewControllerOptions & DetailSkillViewControllerOptions
    ) {
        super(options)
        const { entities } = assertOptions(options, [
            'entities',
            'cancelDestination',
        ])

        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
                friendlyMessage: `You gotta supply at least one entity.`,
            })
        }

        this.options = removeUniversalViewOptions(options)

        this.detailsFormCardVc = this.Controller('crud.detail-form-card', {
            onCancel: this.handleClickCancel.bind(this),
            onSubmit: () => {},
        })
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
        await this.detailsFormCardVc.load(entity.form)

        this.wasLoaded = true
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
}

export type CrudDetailLoadAction = 'edit' | 'create'

export interface CrudDetailSkillViewArgs {
    entity: string
    action: CrudDetailLoadAction
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
