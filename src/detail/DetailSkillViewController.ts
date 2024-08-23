import {
    AbstractSkillViewController,
    buildSkillViewLayout,
    Router,
    SkillView,
    SkillViewControllerId,
    SkillViewControllerLoadOptions,
    ViewControllerOptions,
} from '@sprucelabs/heartwood-view-controllers'
import { assertOptions, SchemaError } from '@sprucelabs/schema'
import { FormCardViewControllerOptions } from '@sprucelabs/spruce-form-utils'
import SpruceError from '../errors/SpruceError'
import DetailsFormCardViewController from './DetailFormCardViewController'

export default class DetailSkillViewController extends AbstractSkillViewController {
    protected detailsCardVc: DetailsFormCardViewController
    private router?: Router
    private entities: DetailSkillViewEntity[]
    protected cancelDestination: SkillViewControllerId

    public constructor(
        options: ViewControllerOptions & DetailSkillViewControllerOptions
    ) {
        super(options)
        const { entities, cancelDestination } = assertOptions(options, [
            'entities',
            'cancelDestination',
        ])

        if (entities.length === 0) {
            throw new SchemaError({
                code: 'INVALID_PARAMETERS',
                parameters: ['entities'],
            })
        }

        this.cancelDestination = cancelDestination
        this.entities = entities

        this.detailsCardVc = this.Controller('crud.detail-form-card', {
            onCancel: this.handleClickCancel.bind(this),
            onSubmit: () => {},
        })
    }

    private async handleClickCancel() {
        await this.router?.redirect(this.cancelDestination, {})
    }

    public async load(
        options: SkillViewControllerLoadOptions<DetailSkillViewArgs>
    ) {
        const { args, router } = options

        this.router = router
        const entityId = args.entityId
        const entity = this.findEntity(entityId)
        await this.detailsCardVc.load(entity.form)
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
                leftCards: [this.detailsCardVc.render()],
            }),
        }
    }
}

export interface DetailSkillViewControllerOptions {
    entities: DetailSkillViewEntity[]
    cancelDestination: SkillViewControllerId
}

export type DetailForm = Omit<FormCardViewControllerOptions<any>, 'id'>

export interface DetailSkillViewEntity {
    id: string
    form: DetailForm
}

export interface DetailSkillViewArgs {
    entityId: string
}

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
    interface SkillViewControllerMap {
        'crud.detail-skill-view': DetailSkillViewController
    }

    interface ViewControllerMap {
        'crud.detail-skill-view': DetailSkillViewController
    }

    interface ViewControllerOptionsMap {
        'crud.detail-skill-view': DetailSkillViewControllerOptions
    }
}
