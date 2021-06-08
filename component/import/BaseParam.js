/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class BaseParam extends Base {

    execute () {
        this.model.set('owner', this.owner.getId());
        this.model.populateRelation('owner', this.owner);
    }

    async resolveClassByName (name) {
        const className = this.model.get(name);
        if (!className) {
            return false;
        }
        const cls = this.meta.getClassByName(className);
        cls ? this.model.set(name, cls.getId())
            : this.model.addError(name, `Class not found: ${className}`);
    }

    async resolveClassAttrByName (name) {
        const attrName = this.model.get(name);
        if (!attrName) {
            return false;
        }
        const paramContainer = this.model.rel('owner'); // behavior
        const classModel = paramContainer.rel('owner'); // class model
        const attr = await classModel.relAttrs().and({name: attrName}).one();
        attr ? this.model.set(name, attr.getId())
             : this.model.addError(name, `Attribute not found: ${attrName}`);
    }
};