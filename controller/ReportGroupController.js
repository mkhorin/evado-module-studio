/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ReportGroupController extends Base {

    getModelClass () {
        return this.getClass('model/ReportGroup');
    }

    async actionCreate () {
        const {pid} = this.getQueryParams();
        const owner = await this.getModel({
            Class: this.getClass('model/Report'),
            id: pid
        });
        const model = this.createModel();
        model.set('report', owner.getId());
        return super.actionCreate({model});
    }

    async actionCreateByGroup () {
        const group = await this.getModel();
        const model = this.createModel();
        model.set('report', group.get('report'));
        if (this.isGetRequest()) {
            model.set('parent', group.getId());
        }
        return super.actionCreate({model});
    }

    actionList () {
        const model = this.createModel();
        const query = model.createQuery().with('report', 'parent');
        return super.actionList(query);
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'reportAttrs': return 'report';
        }
    }
};
module.exports.init(module);