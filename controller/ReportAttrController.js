/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ReportAttrController extends Base {

    async actionCreate () {
        const {pid} = this.getQueryParams();
        const report = await this.getModel({
            Class: this.getClass('model/Report'),
            id: pid
        });
        const model = this.createModel();
        model.set('report', report.getId());
        return super.actionCreate({model});
    }

    actionList () {
        const model = this.spawn('model/ReportAttr');
        const query = model.createQuery().with('class', 'original', 'group');
        return super.actionList(query);
    }

    actionListByReport () {
        const {pid} = this.getQueryParams();
        const query = this.spawn('model/ReportAttr').findByReport(pid);
        return super.actionList(query);
    }

    actionListSelect () {
        const {pid} = this.getPostParams();
        const query = this.spawn('model/ReportAttr').findByReport(pid);
        return this.sendSelectList(query);
    }
};
module.exports.init(module);