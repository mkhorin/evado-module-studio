/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class EnumItemExport extends Base {

    async execute () {
        const data = this.getAttrMap();
        ObjectHelper.deleteProperties([this.model.PK, 'enum'], data);
        const names = Object.keys(data);
        ArrayHelper.remove('value', names);
        ObjectHelper.deleteEmptyProperties(data, names);
        return data;
    }
};

const ArrayHelper = require('areto/helper/ArrayHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');