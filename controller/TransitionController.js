/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class TransitionController extends Base {

    getModelClass () {
        return this.getClass('model/Transition');
    }

    actionCreate () {
        const model = this.createModel();
        model.set('class', model.getDb().normalizeId(this.getQueryParam('pid')));
        return super.actionCreate({model});
    }

    actionListSelect () {
        return this.sendSelectList(this.createModel().findByClass(this.getPostParam('pid')));
    }
};
module.exports.init(module);