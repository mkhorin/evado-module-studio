/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ViewAttrImport extends Base {

    async process () {
        this.model = this.spawn('model/ViewAttr', {scenario: 'create'});
        if (!this.classAttr) {
            return this.assignError('Class attribute not found');
        }
        this._models = [];
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('classAttr', this.classAttr.getId());
        this.model.set('view', this.viewModel.getId());
        this.model.getBehavior('overridden').setStatesByData(this.data);
        this.model.unset('eagerView', 'listView', 'selectListView');
        this.setRelatedAttr('group', this.groupMap);
        if (!this.hasError()) {
            await this.createActionBinder();
        }
        if (!this.hasError()) {
            await this.save();
        }
        if (this.hasError()) {
            await this.clear();
        }
        return PromiseHelper.setImmediate();
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        if (!this.hasError()) {
            await this.createBehaviors();
        }
        if (!this.hasError()) {
            await this.createRules();
        }
        if (!this.hasError()) {
            await this.setRelation();
        }
        return PromiseHelper.setImmediate();
    }

    // BEHAVIORS

    createBehaviors () {
        return PromiseHelper.each(this.data.behaviors, this.createBehavior, this);
    }

    async createBehavior (data) {
        const model = this.spawn('model/ViewAttrBehavior', {scenario: 'create'});
        data.owner = this.model.getId();
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data, this.meta);
        this.assignError(this.Helper.getError(model));
    }

    // RULES

    createRules () {
        return PromiseHelper.each(this.data.rules, this.createRule, this);
    }

    async createRule (data) {
        const model = this.spawn('model/ViewAttrRule', {scenario: 'create'});
        data.owner = this.model.getId();
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data, this.meta);
        this.assignError(this.Helper.getError(model));
    }

    // RELATION

    setRelation () {
        const refClass = this.meta.getClass(this.classAttr.get('refClass'));
        if (!refClass) {
            return false;
        }
        const viewMap = refClass.rel('viewMap');
        if (viewMap) {
            this.setRelatedAttr('eagerView', viewMap);
            this.setRelatedAttr('listView', viewMap);
            this.setRelatedAttr('selectListView', viewMap);
        }
        if (!this.hasError()) {
            return this.model.forceSave();
        }
    }
};

const PromiseHelper = require('areto/helper/PromiseHelper');