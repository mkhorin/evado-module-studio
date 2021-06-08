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
        const value = this.model.get(attr);
        this.model.set(attr, Array.isArray(value) ? value.join(', ') : '');
    }
};