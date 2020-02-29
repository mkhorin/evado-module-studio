/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../base/BaseActiveRecord');

module.exports = class Param extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_param',
            ATTRS: [
                'owner'
            ]
        };
    }

    hasExtendedAttrs () {
        return this.ATTRS.length > 1;
    }

    prepareData () {
    }

    relinkClassAttrs () {
    }

    stringify () {
        const data = {...this.getAttrMap()};
        ObjectHelper.deleteProperties([this.PK, 'owner'], data);
        ObjectHelper.deletePropertiesExcept(this.ATTRS, data);
        return Object.values(data).length
            ? JSON.stringify(data, this.stringifyReplacer.bind(this), ' ')
            : '';
    }

    stringifyReplacer (name, value) {
        return value === null || value === '' ? undefined : value;
    }

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('owner', owner.getId());
        return model.forceSave();
    }
};
module.exports.init();

const ObjectHelper = require('areto/helper/ObjectHelper');