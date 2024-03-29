/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViaExport extends Base {

    async execute () {
        const child = this.viaMap.byParent[this.model.getId()];
        const data = {...this.model.getAttrMap()};
        data.refClass = this.model.get('refClass.name');
        data.refAttr = this.model.get('refAttr.name');
        data.linkAttr = this.model.get('linkAttr.name');
        data.via = await this.getViaData(child);
        ObjectHelper.deleteProperties([this.model.PK, 'parent', 'attr'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    getViaData (model) {
        if (!model) {
            return null;
        }
        const {viaMap} = this;
        const instance = this.spawn(this.constructor, {viaMap, model});
        return instance.execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');