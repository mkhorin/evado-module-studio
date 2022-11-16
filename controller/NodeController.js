/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class NodeController extends Base {

    getModelClass () {
        return this.getClass('model/Node');
    }

    actionCreateBySection () {
        const model = this.createModel();
        const {id} = this.getQueryParams();
        model.set('section', model.getDb().normalizeId(id));
        return super.actionCreate({model});
    }

    async actionCreateByNode () {
        const model = this.createModel();
        const {id} = this.getQueryParams();
        model.set('parent', model.getDb().normalizeId(id));
        await model.setSectionByParent();
        return super.actionCreate({model});
    }

    actionList () {
        const model = this.createModel();
        const query = model.createQuery().with('section', 'parent');
        return super.actionList(query);
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'children': return ['class', 'view', 'report'];
        }
    }
};
module.exports.init(module);