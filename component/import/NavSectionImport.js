/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class NavSectionImport extends Base {

    static getConstants () {
        return {
            RULES: super.RULES.concat([
                ['source', 'default', {value: 'app/navigation/_sectionName_'}]
            ])
        };
    }

    async validateData () {
        await this.validateNavSection();
        if (!this.hasError()) {
            await this.createNodes();
        }
        return PromiseHelper.setImmediate();
    }

    validateNavSection () {
        this.model = this.spawn('model/NavSection', {scenario: 'create'});
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
        const node = this.spawn('import/NavNodeImport', {
            owner: this,
            meta: this.meta,
            sectionModel: this.model,
            nodeMap: this.nodeMap,
            data
        });
        this.nodeImports.push(node);
        return node.process();
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