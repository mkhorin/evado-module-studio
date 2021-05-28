/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ParamExport');

module.exports = class SignatureBehaviorExport extends Base {

    async execute () {
        await this.model.prepareData();
        this.model.set('signature', this.model.get('signature.name'));
        return super.execute();
    }
};