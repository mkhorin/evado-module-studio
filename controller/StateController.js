/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class StateController extends Base {

    getModelClass () {
        return this.getClass('model/State');
    }

    actionCreate () {
        const {pid} = this.getQueryParams();
        const model = this.createModel();
        model.set('class', model.getDb().normalizeId(pid));
        return super.actionCreate({model});
    }

    actionList () {
        const {pid} = this.getQueryParams();
        const query = this.getQueryByClass(pid);
        return super.actionList(query);
    }

    actionListSelect () {
        const {pid} = this.getQueryParams();
        const query = this.getQueryByClass(pid);
        return this.sendSelectList(query);
    }

    getQueryByClass (pid) {
        const model = this.createModel();
        return pid
            ? model.findByClass(pid)
            : model.find().with('class');
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'startingTransitions':
            case 'finishingTransitions': {
                return [
                    'startStates',
                    'finalState'
                ];
            }
        }
    }
};
module.exports.init(module);