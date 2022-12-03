/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class SectionImport extends Base {

    static getConstants () {
        return {
            RULES: super.RULES.concat([
                ['source', 'default', {value: 'app/navigation/_sectionName_'}]
            ])
        };
    }

    async validateData () {
        await this.validateSection();
        if (!this.hasError()) {
            await this.createNodes();
        }
        return PromiseHelper.setImmediate();
    }

    validateSection () {
        this.model = this.spawn('model/Section', {scenario: 'create'});
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('name', this.baseName);
        return this.save();
    }

    // NODES

    createNodes () {
        this.nodeImports = [];
        this.nodeMap = {};
        return PromiseHelper.each(this.data.nodes, data => {
            return this.hasError() ? null : this.createNode(data);
        });
    }

    createNode (data) {
        const instance = this.spawn('import/NodeImport', {
            owner: this,
            meta: this.meta,
            sectionModel: this.model,
            nodeMap: this.nodeMap,
            data
        });
        this.nodeImports.push(instance);
        return instance.process();
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        if (!this.hasError()) {
            await this.meta.resolveClassMap();
        }
        if (!this.hasError()) {
            await this.meta.resolveReportMap();
        }
        await PromiseHelper.each(this.nodeImports, node => {
            return this.hasError() ? null : node.processDeferredBinding();
        });
        return PromiseHelper.setImmediate();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');