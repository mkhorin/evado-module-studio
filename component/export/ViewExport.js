/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViewExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        await this.model.resolveRelations(['class']);
        return this.saveJson(this.getViewFile(), await this.getData());
    }

    getViewFile () {
        return this.getViewPath(`${this.model.get('name')}.json`);
    }

    getViewPath () {
        return super.getViewPath(this.model.get('class.name'), ...arguments);
    }

    async getData () {
        const model = this.model;
        await model.resolveRelations(['attrs', 'behaviors', 'groups', 'rules', 'treeViewLevels']);
        const data = this.getAttrMap();
        data.attrs = await PromiseHelper.map(model.rel('attrs'), this.getAttrData, this);
        data.attrs = data.attrs.filter(item => item);
        data.behaviors = await PromiseHelper.map(model.rel('behaviors'), this.getBehaviorData, this);
        data.behaviors = data.behaviors.filter(item => item);
        data.groups = await PromiseHelper.map(model.rel('groups'), this.getGroupData, this);
        data.groups = data.groups.filter(item => item);
        data.rules = await PromiseHelper.map(model.rel('rules'), this.getRuleData, this);
        data.rules = data.rules.filter(item => item);
        data.treeView = await PromiseHelper.map(model.rel('treeViewLevels'), this.getTreeViewData, this);
        ObjectHelper.deleteProperties([model.PK, 'class', 'name'], data);
        ObjectHelper.deleteEmptyProperties(data);
        ObjectHelper.deletePropertiesByValue(false, data, ['disableGroups', 'disableTreeView']);
        ObjectHelper.deleteEmptyArrayProperties(data);
        return data;
    }

    getAttrData (model) {
        return this.spawn('export/ViewAttrExport', {model}).execute();
    }

    getBehaviorData (model) {
        return this.spawn('export/ViewBehaviorExport', {model}).execute();
    }

    getGroupData (model) {
        return this.spawn('export/ViewGroupExport', {model}).execute();
    }

    getRuleData (model) {
        return this.spawn('export/ViewRuleExport', {model}).execute();
    }

    getTreeViewData (model) {
        return this.spawn('export/TreeViewExport', {model}).execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');