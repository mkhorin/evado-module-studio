/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class NodeImport extends Base {

    async process () {
        this.model = this.spawn('model/Node', {scenario: 'create'});
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('section', this.sectionModel.getId());
        this.model.unset('parent', 'class', 'view', 'report');
        await this.save();
        this.nodeMap[this.data.name] = this.model;
        return PromiseHelper.setImmediate();
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        const data = this.data;
        if (!this.hasError() && data.parent) {
            this.bindParent(data.parent);
        }
        if (!this.hasError() && data.class) {
            this.bindClass(data.class);
        }
        if (!this.hasError() && data.view) {
            this.bindClassView(data.view);
        }
        if (!this.hasError() && data.report) {
            this.bindReport(data.report);
        }
        await this.model.forceSave();
        await PromiseHelper.setImmediate();
    }

    bindParent (name) {
        if (!this.nodeMap.hasOwnProperty(name)) {
            return this.assignError(`Parent not found: ${name}`);
        }
        this.model.set('parent', this.nodeMap[name].getId());
    }

    bindClass (name) {
        this.classModel = this.meta.getClassByName(name);
        if (!this.classModel) {
            return this.assignError(`Class not found: ${name}`);
        }
        this.model.set('class', this.classModel.getId());
    }

    bindClassView (name) {
        if (!this.classModel) {
            return this.assignError('Class not found');
        }
        const viewMap = this.classModel.rel('viewMap');
        if (!viewMap || !viewMap.hasOwnProperty(name)) {
            return this.assignError(`Class view not found: ${name}`);
        }
        this.model.set('view', viewMap[name].getId());
    }

    bindReport (name) {
        const report = this.meta.getReportByName(name);
        if (!report) {
            return this.assignError(`Report not found: ${name}`);
        }
        this.model.set('report', report.getId());
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');