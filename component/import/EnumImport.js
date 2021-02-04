/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class EnumImport extends Base {

    async process () {
        const data = this.data;
        if (!data) {
            return false;
        }
        this.model = this.spawn('model/Enum', {scenario: 'create'});
        this.Helper.assignAttrs(data, this.model);
        this.model.set('owner', this.owner.model.getId());
        const classModel = this.setClass(data.class);
        if (!this.hasError()) {
            this.setView(data.view, classModel);
        }
        if (!this.hasError()) {
            this.setAttr(data.attr, classModel);
        }
        if (!this.hasError()) {
            await this.save();
        }
        if (!this.hasError()) {
            return PromiseHelper.each(this.data.items, this.createItem, this);
        }
    }

    setClass (name) {
        if (name) {
            const model = this.owner.meta.getClassByName(name);
            model ? this.model.set('class', model.getId())
                  : this.assignError(`Unknown class: ${name}`);
            return model;
        }
    }

    setView (name, classModel) {
        if (name) {
            const view = classModel?.rel('viewMap')[name];
            view ? this.model.set('view', view.getId())
                 : this.assignError(`Unknown view: ${name}`);
        }
    }

    setAttr (name, classModel) {
        if (name) {
            const attr = classModel?.rel('attrMap')[name];
            attr ? this.model.set('attr', attr.getId())
                 : this.assignError(`Unknown attr: ${name}`);
        }
    }

    async createItem (data) {
        const model = this.spawn('model/EnumItem', {scenario: 'create'});
        this.Helper.assignAttrs(data, model);
        model.set('enum', this.model.getId());
        await model.save();
        this.assignError(this.Helper.getError(model, 'EnumItem'));
    }
};

const PromiseHelper = require('areto/helper/PromiseHelper');