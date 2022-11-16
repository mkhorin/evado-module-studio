/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassGroupExport extends Base {

    async execute () {
        const data = this.model.hasOriginal()
            ? await this.getInheritedData()
            : await this.getData();
        if (data) {
            ObjectHelper.deleteProperties([this.model.PK, 'class', 'original', 'overriddenState'], data);
            return data;
        }
    }

    async getData () {
        await this.model.resolveRelations(['actionBinder', 'parent']);
        const actionBinder = this.model.rel('actionBinder');
        const data = {
            ...this.getAttrMap(),
            parent: this.model.get('parent.name'),
            active: this.model.get('active') || undefined,
            actionBinder: await this.getActionBinderData(actionBinder)
        };
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    async getInheritedData () {
        await this.model.resolveRelations(['actionBinder', 'parent']);
        const actionBinder = this.model.rel('actionBinder');
        const overridden = this.model.getBehavior('overridden');
        if (!overridden.hasUpdatedAttrs() && !actionBinder) {
            return null;
        }
        const data = {
            ...this.getAttrMap(),
            parent: this.model.get('parent.name'),
            actionBinder: await this.getActionBinderData(actionBinder)
        };
        ObjectHelper.deleteProperties(overridden.getInheritedAttrNames(), data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');