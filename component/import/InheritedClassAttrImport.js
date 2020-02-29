/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ClassAttrImport');

module.exports = class InheritedClassAttrImport extends Base {

    async process () {
        return this.processAfter();
    }

    async processDeferredBinding () {
        this.overridden = this.model.getBehavior('overridden');
        this.overridden.setStatesByData(this.data);
        this.overridden.unsetOriginal();
        this.original = await this.overridden.resolveOriginal();
        await this.overridden.setInheritedValues(this.original);
        this.needSave = true;
        return super.processDeferredBinding();
    }

    async resolveRefClass () {
        const name = this.data.refClass;
        if (name) {
            return super.resolveRefClass();
        }
        const id = await this.overridden.getOriginalValue('refClass', this.original);
        return this.meta.getClass(id);
    }
};
module.exports.init(module);