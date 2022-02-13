/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroupForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        return {
            view: await model.resolveRelation('view'),
            classGroup: await model.resolveRelation('classGroup'),
            validParents: await this.getValidParents(),
            overridden: await model.getBehavior('overridden').getAttrMap()
        };
    }

    getValidParents () {
        const group = this.data.model.rel('classGroup');
        return SelectHelper.handleQueryLabelItems(group.getParentQuery.bind(group));
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');