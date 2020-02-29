/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ParamExport extends Base {

    async execute () {
        const data = this.getAttrMap();
        ObjectHelper.deletePropertiesExcept(this.model.ATTRS, data);
        ObjectHelper.deleteProperties([this.model.PK, 'owner'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');