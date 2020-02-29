/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ParamExport');

module.exports = class TimestampBehaviorExport extends Base {

    async execute () {
        await this.model.prepareData();
        this.model.set('createdAttr', this.model.get('createdAttr.name'));
        this.model.set('updatedAttr', this.model.get('updatedAttr.name'));
        return super.execute();
    }
};