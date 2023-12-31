/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViewExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        await this.model.resolveRelations(['class']);
        const data = await this.getData();
        return this.saveJson(this.getViewFile(), data);
    }

    getViewFile () {
        const name = this.model.get('name');
        return this.getViewPath(`${name}.json`);
    }

    getViewPath () {
        const name = this.model.get('class.name');
        return super.getViewPath(name, ...arguments);
    }

    async getData () {
        const {model} = this;
        await model.resolveRelations([
            'attrs',
            'behaviors',
            'creationView',
            'editView',
            'groups',
            'rules',
            'treeViewLevels'
        ]);
        const data = this.getAttrMap();

        const attrs = model.rel('attrs');
        data.attrs = await PromiseHelper.map(attrs, this.getAttrData, this);
        data.attrs = data.attrs.filter(v => v);

        const behaviors = model.rel('behaviors');
        data.behaviors = await PromiseHelper.map(behaviors, this.getBehaviorData, this);
        data.behaviors = data.behaviors.filter(v => v);

        data.creationView = model.get('creationView.name');
        data.editView = model.get('editView.name');

        const groups = model.rel('groups');
        data.groups = await PromiseHelper.map(groups, this.getGroupData, this);
        data.groups = data.groups.filter(v => v);

        const rules = model.rel('rules');
        data.rules = await PromiseHelper.map(rules, this.getRuleData, this);
        data.rules = data.rules.filter(v => v);

        const treeView = model.rel('treeViewLevels');
        data.treeView = await PromiseHelper.map(treeView, this.getTreeViewData, this);

        ObjectHelper.deleteProperties([model.PK, 'class', 'name'], data);
        ObjectHelper.deleteEmptyProperties(data);
        ObjectHelper.deletePropertiesByValue(false, data, [
            'disableGroups',
            'disableTreeView'
        ]);
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