/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class AttrRuleController extends Base {

    getModelClass () {
        return this.getClass('model/AttrRule');
    }

    actionCreate () {
        const model = this.createModel();
        this.setOwner(model);
        return super.actionCreate({model});
    }

    actionUpdate () {
        return super.actionUpdate({
            beforeUpdate: model => this.setOwner(model)
        });
    }

    setOwner (model) {
        model.set('owner', model.getDb().normalizeId(this.getQueryParam('pid')));
    }

    async saveModel (model) {
        await model.resolveRelation('param');
        await model.validate();
        const paramModel = model.getParamModel();
        if (paramModel) {
            paramModel.load(this.getPostParams());
            await paramModel.validate();
        }
        if (this.hasAnyModelError(model, paramModel)) {
            return this.handleModelError(model, paramModel);
        }
        await model.forceSave();
        if (paramModel) {
            paramModel.set('owner', model.getId());
            await paramModel.forceSave();
        }
        this.sendText(model.getId());
    }
};
module.exports.init(module);