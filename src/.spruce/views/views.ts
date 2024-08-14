import RootSkillViewController from '../../skillViewControllers/Root.svc'

import '@sprucelabs/heartwood-view-controllers'

const vcs = {
    RootSkillViewController,
}

export const pluginsByName = {
}

type LoadOptions<Args extends Record<string,any>[]> = Args[0]['args'] extends Record<string, any> ? Args[0]['args'] : Record<never, any>

declare module '@sprucelabs/heartwood-view-controllers/build/types/heartwood.types' {
	interface SkillViewControllerMap {
		'crud-views.root': RootSkillViewController
	}

	interface SkillViewControllerArgsMap {
		'crud-views.root': LoadOptions<Parameters<RootSkillViewController['load']>>
	}

	interface ViewControllerMap {
		'crud-views.root': RootSkillViewController
	}

    interface ViewControllerOptionsMap {
	}

	interface ViewControllerPlugins {
	}
}

//@ts-ignore
if(typeof heartwood === 'function') { 
	//@ts-ignore
	heartwood(vcs, pluginsByName) 
}

export default vcs
