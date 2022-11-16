/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseParam');

module.exports = class FileParamBehavior extends Base {

    async execute () {
        await super.execute();
        this.join('extensions');
        this.join('types');
        await this.resolveClassAttrByName('nameAttr');
    }

    join (attr) {
        let value = this.model.get(attr);
        value = Array.isArray(value) ? value.join(', ') : '';
        this.model.set(attr, value);
    }
};