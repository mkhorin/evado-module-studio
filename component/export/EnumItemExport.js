/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class EnumItemExport extends Base {

    async execute () {
        const data = this.getAttrMap();
        ObjectHelper.deleteProperties([this.model.PK, 'enum', 'orderNumber'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');