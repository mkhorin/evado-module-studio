/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class NodeForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        await model.resolveRelations(['class', 'view', 'report']);
        const parent = await model.resolveRelation('parent');
        const section = await  model.resolveRelation('section');
        const validParents = await SelectHelper.handleQueryLabelItems(model.getParentQuery.bind(model));
        return {parent, section, validParents};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');