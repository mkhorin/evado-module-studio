/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ReportAttrController extends Base {

    async actionCreate () {
        const report = await this.getModel({
            Class: this.getClass('model/Report'),
            id: this.getQueryParam('pid')
        });
        const model = this.createModel();
        model.set('report', report.getId());
        return super.actionCreate({model});
    }

    actionList () {
        const query = this.spawn('model/ReportAttr').createQuery().with('class', 'original', 'group');
        return super.actionList(query);
    }

    actionListByReport () {
        const query = this.spawn('model/ReportAttr').findByReport(this.getQueryParam('pid'));
        return super.actionList(query);
    }

    actionListSelect () {
        const query = this.spawn('model/ReportAttr').findByReport(this.getPostParam('pid'));
        return this.sendSelectList(query);
    }
};
module.exports.init(module);