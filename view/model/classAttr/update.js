/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./_form');

module.exports = class UpdateClassAttrForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations([
            'class',
            'eagerView',
            'group',
            'linkAttr',
            'listView',
            'refClass',
            'refAttr',
            'selectListView'
        ]);
    }
};