/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseParam');

module.exports = class TimestampParamBehavior extends Base {

    async execute () {
        await super.execute();
        await this.resolveClassAttrByName('createdAttr');
        await this.resolveClassAttrByName('updatedAttr');
    }
};