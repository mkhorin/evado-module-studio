/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ViewGroupImport extends Base {

    async process () {
        this.model = this.spawn('model/ViewGroup', {scenario: 'create'});
        if (!this.groupModel) {
            return this.assignError('Group not found');
        }
        this._models = [];
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('classGroup', this.groupModel.getId());
        this.model.set('view', this.viewModel.getId());
        this.model.getBehavior('overridden').setStatesByData(this.data);
        await this.createActionBinder();
        if (!this.hasError()) {
            await this.save();
        }
        if (this.hasError()) {
            await this.clear();
        }
        return PromiseHelper.setImmediate();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');