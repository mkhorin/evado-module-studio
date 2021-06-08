/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../_base/ParamContainer');

module.exports = class ClassRuleSort extends Base {

    async resolveTemplateData () {
        for (const model of this.data.models) {
            model.setRelatedViewAttr('attrs');
        }
        await this.prepareModels(this.data.models);
    }
};