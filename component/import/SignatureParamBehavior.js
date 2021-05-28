/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseParam');

module.exports = class SignatureParamBehavior extends Base {

    async execute () {
        await super.execute();
        await this.resolveClassByName('signature');
    }
};