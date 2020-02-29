/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ClassGroupImport extends Base {

    process () {
        const ClassGroup = this.getClass('model/ClassGroup');
        this.model = this.spawn(ClassGroup, {scenario: 'create'});
        return this.processAfter();
    }

    async processAfter () {
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('class', this.classModel.getId());
        this.model.detachBehavior('ancestor');
        this.groupMap[this.data.name] = this.model;
        this._models = [];
        this.setParentGroup();
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

    setParentGroup () {
        if (!this.data.parent) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(this.groupMap, this.data.parent)) {
            return this.assignError('Parent not found');
        }
        this.model.set('parent', this.groupMap[this.data.parent].getId());
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');