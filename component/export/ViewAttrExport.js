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
        const actionBinder = this.model.rel('actionBinder');
        const behaviors = this.model.rel('behaviors');
        const rules = this.model.rel('rules');
        const data = {
            actionBinder: await this.getActionBinderData(actionBinder),
            behaviors: await PromiseHelper.map(behaviors, this.getBehaviorData, this),
            rules: await PromiseHelper.map(rules, this.getRuleData, this)
        };
        return this.getData(data);
    }

    getData ({actionBinder, behaviors, rules}) {
        const {model} = this;
        const overridden = model.getBehavior('overridden');
        const data = {
            name: model.get('classAttr.name'),
            ...this.getAttrMap()
        };
        behaviors = behaviors.filter(v => v);
        data.behaviors = behaviors.length ? behaviors : undefined;
        rules = rules.filter(v => v);
        data.rules = rules.length ? rules : undefined;
        data.group = model.get('group.name') ?? null;
        data.eagerView = model.get('eagerView.name') ?? null;
        data.listView = model.get('listView.name') ?? null;
        data.selectListView = model.get('selectListView.name') ?? null;
        data.actionBinder = actionBinder;
        const names = overridden.getInheritedAttrNames();
        ObjectHelper.deleteProperties(names, data);
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