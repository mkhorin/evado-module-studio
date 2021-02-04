/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./_form');

module.exports = class AttrBehaviorCreate extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        for (const model of Object.values(data.paramModelMap)) {
            await model.setDefaultValues();
        }
        return data;
    }
};