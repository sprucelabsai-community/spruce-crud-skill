import {
    AbstractSkillViewController,
    ViewControllerOptions,
    SkillView,
} from '@sprucelabs/heartwood-view-controllers'

export default class RootSkillViewController extends AbstractSkillViewController {
    public static id = 'root'

    public constructor(options: ViewControllerOptions) {
        super(options)
    }

    public render(): SkillView {
        return {
            layouts: [
                {
                    cards: [],
                },
            ],
        }
    }
}
