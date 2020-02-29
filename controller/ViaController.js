/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViaController extends Base {

    getModelClass () {
        return this.getClass('model/Via');
    }

    actionCreateByAttr () {
        const model = this.createModel();
        model.set('attr', model.getDb().normalizeId(this.getQueryParam('id')));
        return super.actionCreate({model});
    }

    actionCreateByVia () {
        const model = this.createModel();
        model.set('parent', model.getDb().normalizeId(this.getQueryParam('id')));
        return super.actionCreate({model});
    }

    actionUpdate () {
        return super.actionUpdate({
            //beforeUpdate: model => this.setOwner(model),
            //getParamsByModel: model => ({template: model.hasOriginal() ? 'inherited' : 'update'}),
            with: ['refClass', 'refAttr', 'linkAttr']
        });
    }

    actionListRelated () {
        return super.actionListRelated({with: ['refClass', 'refAttr', 'linkAttr']});
    }
};
module.exports.init(module);