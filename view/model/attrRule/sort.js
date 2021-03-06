/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../_base/ParamContainer');

module.exports = class AttrRuleSort extends Base {

    async resolveTemplateData () {
        await this.prepareModels(this.data.models);
    }
};