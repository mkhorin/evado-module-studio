/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrRules extends Base {

    async prepareModels (models) {
        for (const model of models) {
            await model.resolveRelation('param');
            model.setViewAttr('param', model.getParamModel().stringify());
        }
    }
};