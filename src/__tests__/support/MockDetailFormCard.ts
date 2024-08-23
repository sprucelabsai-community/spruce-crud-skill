import { SpyFormCardViewController } from '@sprucelabs/spruce-form-utils'
import { assert } from '@sprucelabs/test-utils'
import DetailsFormCardViewController from '../../detail/DetailFormCardViewController'
import { DetailForm } from '../../detail/DetailSkillViewController'

export default class MockDetailFormCard extends DetailsFormCardViewController {
    public assertFormOptionsEqual(options: DetailForm) {
        const formVc = this.getFormCardVc()
        assert.isTruthy(
            formVc?.constructorOptions,
            'Form card not loaded or SpyFormCardViewController not set to `forms.card`'
        )

        assert.isEqualDeep(
            formVc.constructorOptions.schema,
            options.schema,
            'Schema does not match'
        )
        assert.isEqualDeep(formVc.constructorOptions.sections, options.sections)
    }

    private getFormCardVc() {
        return this.formCardVc as SpyFormCardViewController
    }

    public getFormVc() {
        return this.getFormCardVc().formVc
    }
}
