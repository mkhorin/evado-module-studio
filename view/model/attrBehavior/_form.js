/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class AttrBehaviorForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        const owner = await model.resolveRelation('owner');
        const paramModel = await model.resolveRelation('param');
        const paramModelMap = model.getParamModelMap();
        return {owner, paramModel, paramModelMap};
    }

    async resolveModelRelations (models, data) {
        for (const key of Object.keys(data)) {
            if (Object.prototype.hasOwnProperty.call(models, key)) {
                for (const name of data[key]) {
                    await this.resolveModelRelation(name, models[key]);
                }
            }
        }
    }

    async resolveModelRelation (name, model) {
        const query = model.getRelation(name).addSelect('label').raw(false);
        const data = await query.one();
        model.populateRelation(name, data);
    }
};