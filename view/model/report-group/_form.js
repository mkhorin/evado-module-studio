/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportGroupForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        return {
            report: await model.resolveRelation('report'),
            parent: await model.resolveRelation('parent'),
            validParents: await SelectHelper.handleQueryLabelItems(model.getParentQuery.bind(model))
        };
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');