/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassAttrExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        const data = this.model.hasOriginal()
            ? await this.getInheritedData()
            : await this.getData();
        if (data) {
            ObjectHelper.deleteProperties([this.model.PK, 'class', 'original', 'overriddenState'], data);
            ObjectHelper.deleteEmptyArrayProperties(data);
            return ObjectHelper.sortByKeys(['name', 'label', 'type', 'viewType', 'description'], data);
        }
    }

    async getData () {
        const model = this.model;
        await model.resolveRelations([
            'actionBinder',
            'behaviors',
            'eagerView',
            'enums',
            'group',
            'linkAttr',
            'listView',
            'refAttr',
            'refClass',
            'rules',
            'selectListView'
        ]);
        const data = {
            ...this.getAttrMap(),
            actionBinder: await this.getActionBinderData(model.rel('actionBinder')),
            behaviors: await PromiseHelper.map(model.rel('behaviors'), this.getBehaviorData, this),
            eagerView: model.get('eagerView.name'),
            enums: await PromiseHelper.map(model.rel('enums'), this.getEnumData, this),
            group: model.get('group.name'),
            linkAttr: model.get('linkAttr.name'),
            listView: model.get('listView.name'),
            refAttr: model.get('refAttr.name'),
            refClass: model.get('refClass.name'),
            rules: await PromiseHelper.map(model.rel('rules'), this.getRuleData, this),
            selectListView: model.get('selectListView.name'),
            via: await this.getViaData(model),
        };
        if (!model.isRelation()) {
            delete data.commands;
        }
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    async getInheritedData () {
        const model = this.model;
        await model.resolveRelations([
            'actionBinder',
            'eagerView',
            'group',
            'linkAttr',
            'listView',
            'refAttr',
            'refClass',
            'rules',
            'selectListView'
        ]);
        const actionBinder = model.rel('actionBinder');
        const rules = await PromiseHelper.map(model.rel('rules'), this.getRuleData, this);
        const overridden = model.getBehavior('overridden');
        if (!overridden.hasUpdatedAttrs() && !rules.length && !actionBinder) {
            return null;
        }
        const data = {
            ...this.getAttrMap(),
            actionBinder: await this.getActionBinderData(actionBinder),
            eagerView: model.get('eagerView.name'),
            group: model.get('group.name'),
            linkAttr: model.get('linkAttr.name'),
            listView: model.get('listView.name'),
            refAttr: model.get('refAttr.name'),
            refClass: model.get('refClass.name'),
            rules: rules.length ? rules : undefined,
            selectListView: model.get('selectListView.name')
        };
        if (!model.isRelation()) {
            delete data.commands;
        }
        ObjectHelper.deleteProperties(overridden.getInheritedAttrNames(), data);
        ObjectHelper.deleteProperties(['type', 'expression', 'history'], data);
        return data;
    }

    getBehaviorData (model) {
        return this.spawn(AttrBehaviorExport, {model}).execute();
    }

    getEnumData (model) {
        return this.spawn(EnumExport, {model}).execute();
    }

    getRuleData (model) {
        return this.spawn(AttrRuleExport, {model}).execute();
    }

    getViaData (model) {
        const viaMap = this.viaMap;
        model = this.viaMap.byAttr[model.getId()];
        return model ? this.spawn(ViaExport, {viaMap, model}).execute() : null;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');
const AttrBehaviorExport = require('./AttrBehaviorExport');
const AttrRuleExport = require('./AttrRuleExport');
const EnumExport = require('./EnumExport');
const ViaExport = require('./ViaExport');