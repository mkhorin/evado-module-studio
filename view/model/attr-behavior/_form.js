/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class AttrBehaviorForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        return {
            owner: await model.resolveRelation('owner'),
            paramModel: await model.resolveRelation('param'),
            paramModelMap: model.getParamModelMap()
        };
    }

    async resolveModelRelations (models, data) {
        for (const key of Object.keys(data)) {
            if (models.hasOwnProperty(key)) {
                for (const name of data[key]) {
                    await this.resolveModelRelation(name, models[key]);
                }
            }
        }
    }

    async resolveModelRelation (name, model) {
        const query = model.getRelation(name).addSelect('label').raw(false);
        model.populateRelation(name, await query.one());
    }
};