/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassAttrMainGroup extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations([
            'eagerView',
            'linkAttr',
            'listView',
            'refClass',
            'refAttr',
            'selectListView'
        ]);
    }
};