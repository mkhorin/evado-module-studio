/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class StateExport extends Base {

    async execute () {
        await this.model.resolveRelations(['view']);
        return this.getData();
    }

    getData () {
        const data = this.getAttrMap();
        data.view = this.model.get('view.name');
        ObjectHelper.deleteProperties([this.model.PK, 'class'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');