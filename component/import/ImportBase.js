/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class ImportBase extends Base {

    constructor (config) {
        super({
            Helper: config.module.getClass('import/ImportHelper'),
            ...config
        });
    }

    hasError () {
        return this.owner.hasError();
    }

    getErrors () {
        return this.owner.getErrors();
    }

    assignError (message) {
        if (message) {
            message = this.data.name ? `${this.data.name}: ${message}` : message;
            this.owner.assignError(this.wrapClassMessage(message));
        }
    }

    async save () {
        if (!await this.model.save()) {
            this.assignError(this.Helper.getError(this.model));
        }
    }

    clear () {
        return PromiseHelper.eachMethod(this._models, 'delete');
    }

    processDeferredBinding () {
    }

    async createActionBinder () {
        if (!this.data.actionBinder) {
            return false;
        }
        const model = this.spawn('model/ActionBinder', {scenario: 'create'});
        this.Helper.assignAttrs(this.data.actionBinder, model);
        await model.save()
            ? this.model.set('actionBinder', {links: [model.getId()]})
            : this.assignError(this.Helper.getError(model, 'ActionBinder'));
    }

    setRelatedAttr (name, modelMap) {
        const value = this.data[name];
        if (value) {
            modelMap.hasOwnProperty(value)
                ? this.model.set(name, modelMap[value].getId())
                : this.assignError(`Unknown ${name}: ${value}`);
        }
    }
};

const PromiseHelper = require('areto/helper/PromiseHelper');