/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ParamContainerExport extends Base {

    async execute () {
        const data = this.getAttrMap();
        const param = await this.model.resolveRelation('param');
        if (param) {
            Object.assign(data, await this.getParamData(param));
        }
        ObjectHelper.deleteProperties([this.model.PK, 'owner', 'orderNumber'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    getParamData (model) {
        const handler = this.getParamHandler(model);
        return handler ? handler(model) : this.spawn(ParamExport, {model}).execute();
    }

    getParamHandler () {
        return null; // override
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const ParamExport = require('./ParamExport');