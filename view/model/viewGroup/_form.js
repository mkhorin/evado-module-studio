/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroupForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const view = await model.resolveRelation('view');
        const classGroup = await model.resolveRelation('classGroup');
        const validParents = await this.getValidParents();
        const overridden = await model.getBehavior('overridden').getAttrMap();
        return {view, classGroup, validParents, overridden};
    }

    getValidParents () {
        const group = this.data.model.rel('classGroup');
        return SelectHelper.handleQueryLabelItems(group.getParentQuery.bind(group));
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');