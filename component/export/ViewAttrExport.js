/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViewAttrExport extends Base {

    async execute () {
        await this.model.resolveRelations([
            'actionBinder',
            'behaviors',
            'classAttr',
            'group',
            'rules',
            'eagerView',
            'listView',
            'selectListView'
        ]);
        return this.getData({
            'actionBinder': await this.getActionBinderData(this.model.rel('actionBinder')),
            'behaviors': await PromiseHelper.map(this.model.rel('behaviors'), this.getBehaviorData, this),
            'rules': await PromiseHelper.map(this.model.rel('rules'), this.getRuleData, this)
        });
    }

    getData ({actionBinder, behaviors, rules}) {
        const model = this.model;
        const overridden = model.getBehavior('overridden');
        const data = {
            name: model.get('classAttr.name'),
            ...this.getAttrMap()
        };
        behaviors = behaviors.filter(item => item);
        data.behaviors = behaviors.length ? behaviors : undefined;
        rules = rules.filter(item => item);
        data.rules = rules.length ? rules : undefined;
        data.group = model.get('group.name') ?? null;
        data.eagerView = model.get('eagerView.name') ?? null;
        data.listView = model.get('listView.name') ?? null;
        data.selectListView = model.get('selectListView.name') ?? null;
        data.actionBinder = actionBinder;
        ObjectHelper.deleteProperties(overridden.getInheritedAttrNames(), data);
        ObjectHelper.deleteProperties([model.PK, 'view', 'classAttr', 'overriddenState'], data);
        return data;
    }

    getBehaviorData (model) {
        return this.spawn(ViewAttrBehaviorExport, {model}).execute();
    }

    getRuleData (model) {
        return this.spawn(ViewAttrRuleExport, {model}).execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');
const ViewAttrBehaviorExport = require('./ViewAttrBehaviorExport');
const ViewAttrRuleExport = require('./ViewAttrRuleExport');