/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        await this.model.resolveRelation('views');
        const viaMap = this.viaMap || await this.getViaMap();
        await FileHelper.delete(this.getClassViewPath());
        for (const item of this.model.rel('views')) {
            await this.exportView(item);
        }
        return this.saveJson(this.getClassFile(), await this.getData(viaMap));
    }

    getClassFile () {
        return this.getClassPath(`${this.model.get('name')}.json`);
    }

    getClassViewPath () {
        return this.getViewPath(this.model.get('name'), ...arguments);
    }

    exportView (model) {
        if (!model.hasOriginal()) {
            return this.spawn('export/ViewExport', {exporter: this.exporter, model}).execute();
        }
    }

    async getData (viaMap) {
        const model = this.model;
        await model.resolveRelations([
            'activeDescendants',
            'attrs',
            'forbiddenView',
            'groups',
            'indexes',
            'key',
            'behaviors',
            'parent',
            'rules',
            'states',
            'stateMap',
            'transitions',
            'treeViewLevels'
        ]);
        const data = this.getAttrMap();
        data.attrs = await PromiseHelper.map(model.rel('attrs'), this.getAttrData.bind(this, viaMap));
        data.attrs = data.attrs.filter(item => item);
        data.behaviors = await PromiseHelper.map(model.rel('behaviors'), this.getBehaviorData, this);
        data.behaviors = data.behaviors.filter(item => item);
        data.forbiddenView = model.get('forbiddenView.name');
        data.groups = await PromiseHelper.map(model.rel('groups'), this.getGroupData, this);
        data.groups = data.groups.filter(item => item);
        data.indexes = await PromiseHelper.map(model.rel('indexes'), this.getIndexData, this);
        data.indexes = data.indexes.filter(item => item);
        data.key = model.get('key.name');
        data.parent = model.get('parent.name');
        data.rules = await PromiseHelper.map(model.rel('rules'), this.getRuleData, this);
        data.rules = data.rules.filter(item => item);
        data.states = await PromiseHelper.map(model.rel('states'), this.getStateData, this);
        data.states = data.states.filter(item => item);
        data.transitions = await PromiseHelper.map(model.rel('transitions'), this.getTransitionData, this);
        data.transitions = data.transitions.filter(item => item);
        data.treeView = await PromiseHelper.map(model.rel('treeViewLevels'), this.getTreeViewData, this);
        delete data.activeDescendants; // move to end
        data.activeDescendants = model.rel('activeDescendants').map(model => model.get('name'));
        ObjectHelper.deleteProperties([model.PK, 'name'], data);
        ObjectHelper.deleteEmptyProperties(data);
        ObjectHelper.deleteEmptyArrayProperties(data);
        ObjectHelper.deletePropertiesByValue(false, data, ['disableTreeView']);
        return data;
    }

    getBehaviorData (model) {
        return this.spawn('export/ClassBehaviorExport', {model}).execute();
    }

    getRuleData (model) {
        return this.spawn('export/ClassRuleExport', {model}).execute();
    }

    getAttrData (viaMap, model) {
        return this.spawn('export/ClassAttrExport', {model, viaMap}).execute();
    }

    getIndexData (model) {
        return this.spawn('export/ClassIndexExport', {model}).execute();
    }

    getGroupData (model) {
        return this.spawn('export/ClassGroupExport', {model}).execute();
    }

    getStateData (model) {
        return this.spawn('export/StateExport', {model}).execute();
    }

    getTransitionData (model) {
        return this.spawn('export/TransitionExport', {class: this.model, model}).execute();
    }

    getTreeViewData (model) {
        return this.spawn('export/TreeViewExport', {model}).execute();
    }
};

const FileHelper = require('areto/helper/FileHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');