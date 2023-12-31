/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrRelationGroup extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations([
            'class',
            'eagerView',
            'listView',
            'selectListView'
        ]);
        const overridden = await model.getBehavior('overridden').getAttrMap();
        return {overridden};
    }
};