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

    actionList () {
        return super.actionList(this.getQueryByClass(this.getQueryParam('pid')));
    }

    actionListSelect () {
        return this.sendSelectList(this.getQueryByClass(this.getPostParam('pid')));
    }

    getQueryByClass (pid) {
        const model = this.createModel();
        return pid ? model.findByClass(pid) : model.find().with('class');
    }
};
module.exports.init(module);