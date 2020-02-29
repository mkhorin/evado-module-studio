/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        await model.resolveRelations(['class', 'group', 'view', 'eagerView', 'listView', 'selectListView']);
        return {
            overridden: await model.getBehavior('overridden').getAttrMap()
        };
    }
};