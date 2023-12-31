/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ViaImport extends Base {

    async process () {
        const {data} = this;
        this.model = this.spawn('model/Via', {scenario: 'create'});
        if (this.parent) {
            this.model.set('attr', null);
            this.model.set('parent', this.parent.getId());
        } else {
            this.model.set('attr', this.owner.model.getId());
            this.model.set('parent', null);
        }
        const refClass = this.owner.meta.getClassByName(data.refClass);
        if (!refClass) {
            return this.assignError(`Unknown refClass: ${data.refClass}`);
        }
        this.model.set('refClass', refClass.getId());
        const attrMap = refClass.rel('attrMap');
        if (attrMap) {
            this.setRelatedAttr('refAttr', attrMap);
            this.setRelatedAttr('linkAttr', attrMap);
        }
        return this.save();
    }

    async save () {
        if (this.hasError()) {
            return false;
        }
        await this.model.save()
            ? await this.createVia()
            : this.assignError(this.Helper.getError(this.model));
    }

    createVia () {
        if (!this.data.via) {
            return false;
        }
        const instance = this.spawn('import/ViaImport', {
            owner: this.owner,
            parent: this.model,
            data: this.data.via
        });
        return instance.process();
    }
};