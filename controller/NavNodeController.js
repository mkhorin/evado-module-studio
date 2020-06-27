/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class NavNodeController extends Base {

    getModelClass () {
        return this.getClass('model/NavNode');
    }

    actionCreateBySection () {
        const model = this.createModel();
        model.set('section', model.getDb().normalizeId(this.getQueryParam('id')));
        return super.actionCreate({model});
    }

    async actionCreateByNode () {
        const model = this.createModel();
        model.set('parent', model.getDb().normalizeId(this.getQueryParam('id')));
        await model.setSectionByParent();
        return super.actionCreate({model});
    }

    actionList () {
        return super.actionList(this.createModel().find().with('section', 'parent'));
    }

    actionListRelated (params = {}) {
        switch (this.getQueryParam('rel')) {
            case 'children':
                params.with = ['class', 'view', 'report'];
                break;
        }
        return super.actionListRelated(params);
    }
};
module.exports.init(module);