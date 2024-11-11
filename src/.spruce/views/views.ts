import DetailSkillViewController from '../../skillViewControllers/Detail.svc'
import RootSkillViewController from '../../skillViewControllers/Root.svc'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    DetailSkillViewController,
    RootSkillViewController,
}

export const pluginsByName = {
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'crud.detail': DetailSkillViewController
		'crud.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'crud.detail': LoadOptions<Parameters<DetailSkillViewController['load']>>
		'crud.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'crud.detail': DetailSkillViewController
		'crud.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
	}

	interface ViewControllerPlugins {
	}
}

//@ts-ignore
if(typeof heartwood === 'function') { 
	//@ts-ignore
	heartwood({ vcs, pluginsByName }) 
}

export default vcs
