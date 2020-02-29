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
        const owner = await this.getModel({
            Class: this.getClass('model/Report'),
            id: this.getQueryParam('pid')
        });
        const model = this.createModel();
        model.set('report', owner.getId());
        return super.actionCreate({model});
    }

    async actionCreateByGroup () {
        const group = await this.getModel();
        const model = this.createModel();
        model.set('report', group.get('report'));
        if (this.isGet()) {
            model.set('parent', group.getId());
        }
        return super.actionCreate({model});
    }

    actionList () {
        return super.actionList(this.createModel().find().with('report', 'parent'));
    }

    actionListRelated (params = {}) {
        switch (this.getQueryParam('rel')) {
            case 'reportAttrs': params.with = 'report'; break;
        }
        return super.actionListRelated(params);
    }
};
module.exports.init(module);