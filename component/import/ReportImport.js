/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class ReportImport extends Base {

    static getConstants () {
        return {
            RULES: [
                ...super.RULES,
                ['source', 'default', {value: 'app/report/_reportName_'}]
            ]
        };
    }

    async validateData () {
        await this.validateReport();
        if (!this.hasError()) {
            return this.createAttrs();
        }
    }

    validateReport () {
        this.model = this.spawn('model/Report', {scenario: 'create'});
        this.data.name = this.baseName;
        this.Helper.assignAttrs(this.data, this.model);
        return this.save();
    }

    // ATTRIBUTES

    createAttrs () {
        this.attrImports = [];
        this.attrMap = {};
        return PromiseHelper.each(this.data.attrs, this.createAttr, this);
    }

    createAttr (data) {
        const instance = this.spawn('import/ReportAttrImport', {
            owner: this,
            meta: this.meta,
            reportModel: this.model,
            attrMap: this.attrMap,
            data
        });
        this.attrImports.push(instance);
        return instance.process();
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        if (this.hasError()) {
            return false;
        }
        for (const model of this.attrImports) {
            if (!this.hasError()) {
                await model.processDeferredBinding();
            }
        }
        await this.deleteOnError();
        return PromiseHelper.setImmediate();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');