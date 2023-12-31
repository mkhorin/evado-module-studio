/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassGroupForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations(['class', 'parent']);
        const validParents = await SelectHelper.handleQueryLabelItems(model.getParentQuery.bind(model));
        return {validParents};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');