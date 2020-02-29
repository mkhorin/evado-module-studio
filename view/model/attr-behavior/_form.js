/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class AttrBehaviorForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        const result = {
            owner: await model.resolveRelation('owner'),
            paramModel: await model.resolveRelation('param'),
            paramModelMap: model.getParamModelMap()
        };
        for (const paramModel of Object.values(result.paramModelMap)) {
            await paramModel.setDefaultValues();
        }
        return result;
    }
};