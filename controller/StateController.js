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
        const model = this.createModel();
        model.set('class', model.getDb().normalizeId(this.getQueryParam('pid')));
        return super.actionCreate({model});
    }

    actionList () {
        return super.actionList(this.createModel().findByClass(this.getQueryParam('pid')));
    }

    actionListSelect () {
        return this.sendSelectList(this.createModel().findByClass(this.getPostParam('pid')));
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'startingTransitions':
            case 'finishingTransitions':
                return ['startStates', 'finalState'];
        }
    }
};
module.exports.init(module);