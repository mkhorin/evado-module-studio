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
        const data = await this.getData(viaMap);
        return this.saveJson(this.getClassFile(), data);
    }

    getClassFile () {
        const name = this.model.get('name');
        return this.getClassPath(`${name}.json`);
    }

    getClassViewPath () {
        const name = this.model.get('name');
        return this.getViewPath(name, ...arguments);
    }

    exportView (model) {
        if (!model.hasOriginal()) {
            const viewExport = this.spawn('export/ViewExport', {
                exporter: this.exporter,
                model
            });
            return viewExport.execute();
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
            'treeViewLevels',
            'version'
        ]);
        const data = this.getAttrMap();

        const attrs = model.rel('attrs');
        data.attrs = await PromiseHelper.map(attrs, this.getAttrData.bind(this, viaMap));
        data.attrs = data.attrs.filter(v => v);

        const behaviors = model.rel('behaviors');
        data.behaviors = await PromiseHelper.map(behaviors, this.getBehaviorData, this);
        data.behaviors = data.behaviors.filter(v => v);

        data.forbiddenView = model.get('forbiddenView.name');

        const groups = model.rel('groups');
        data.groups = await PromiseHelper.map(groups, this.getGroupData, this);
        data.groups = data.groups.filter(v => v);

        const indexes = model.rel('indexes');
        data.indexes = await PromiseHelper.map(indexes, this.getIndexData, this);
        data.indexes = data.indexes.filter(v => v);

        data.key = model.get('key.name');
        data.parent = model.get('parent.name');

        const rules = model.rel('rules');
        data.rules = await PromiseHelper.map(rules, this.getRuleData, this);
        data.rules = data.rules.filter(v => v);

        const states = model.rel('states');
        data.states = await PromiseHelper.map(states, this.getStateData, this);
        data.states = data.states.filter(v => v);

        const transitions = model.rel('transitions');
        data.transitions = await PromiseHelper.map(transitions, this.getTransitionData, this);
        data.transitions = data.transitions.filter(v => v);

        const treeView = model.rel('treeViewLevels');
        data.treeView = await PromiseHelper.map(treeView, this.getTreeViewData, this);

        delete data.activeDescendants; // move to end
        data.activeDescendants = model.rel('activeDescendants').map(model => model.get('name'));
        data.version = model.get('version.name');

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
        const transitionExport = this.spawn('export/TransitionExport', {
            class: this.model,
            model
        });
        return transitionExport.execute();
    }

    getTreeViewData (model) {
        return this.spawn('export/TreeViewExport', {model}).execute();
    }
};

const FileHelper = require('areto/helper/FileHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');