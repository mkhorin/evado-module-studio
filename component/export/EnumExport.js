/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class EnumExport extends Base {

    async execute () {
        const data = this.getAttrMap();
        const items = await this.model.resolveRelation('items');
        data.items = await PromiseHelper.map(items, this.getItemData, this);
        data.attr = this.model.get('attr.name');
        data.class = this.model.get('class.name');
        data.view = this.model.get('view.name');
        ObjectHelper.deleteProperties([this.model.PK, 'owner'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    getItemData (model) {
        return this.spawn('export/EnumItemExport', {model}).execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');