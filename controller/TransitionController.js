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
        const {pid} = this.getQueryParams();
        model.set('class', model.getDb().normalizeId(pid));
        return super.actionCreate({model});
    }

    actionList () {
        const {pid} = this.getQueryParams();
        return super.actionList(this.getQueryByClass(pid));
    }

    actionListSelect () {
        const {pid} = this.getPostParams();
        return this.sendSelectList(this.getQueryByClass(pid));
    }

    getQueryByClass (pid) {
        const model = this.createModel();
        return pid
            ? model.findByClass(pid)
            : model.find().with('class');
    }
};
module.exports.init(module);