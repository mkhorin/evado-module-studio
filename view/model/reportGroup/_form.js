/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportGroupForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const report = await model.resolveRelation('report');
        const parent = await model.resolveRelation('parent');
        const validParents = await SelectHelper.handleQueryLabelItems(model.getParentQuery.bind(model));
        return {report, parent, validParents};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');