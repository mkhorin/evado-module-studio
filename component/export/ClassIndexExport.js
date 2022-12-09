/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassIndexExport extends Base {

    async execute () {
        const attrs = await this.model.resolveRelation('attrs');
        return this.getData(attrs);
    }

    getData (attrs) {
        const keys = {};
        attrs.forEach(attr => keys[attr.get('attr.name')] = attr.get('direction'));
        const options = {
            name: this.model.get('name'),
            unique: this.model.get('unique'),
            background: this.model.get('background'),
            ...this.model.get('options')
        };
        ObjectHelper.deleteEmptyProperties(options);
        ObjectHelper.deletePropertiesByValue(false, options);
        return [keys, options];
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');