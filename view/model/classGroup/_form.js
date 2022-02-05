/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassGroupForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        await model.resolveRelations(['class', 'parent']);
        return {
            validParents: await SelectHelper.handleQueryLabelItems(model.getParentQuery.bind(model))
        };
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');