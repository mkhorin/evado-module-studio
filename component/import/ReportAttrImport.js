/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ReportAttrImport extends Base {

    async process () {
        const ReportAttr = this.getClass('model/ReportAttr');
        if (!this.model) {
            this.model = this.spawn(ReportAttr, {scenario: 'create'});
        }
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('report', this.reportModel.getId());
        this.attrMap[this.data.name] = this.model;
        this._models = [];
        await this.save();
        if (this.hasError()) {
            await this.clear();
        }
        return PromiseHelper.setImmediate();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');