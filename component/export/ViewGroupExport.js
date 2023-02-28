/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViewGroupExport extends Base {

    async execute () {
        await this.model.resolveRelations(['actionBinder', 'classGroup', 'parent']);
        const actionBinder = this.model.rel('actionBinder');
        const actionBinderData = await this.getActionBinderData(actionBinder);
        return this.getData({
            actionBinder: actionBinderData
        });
    }

    getData (result) {
        const model = this.model;
        const data = {
            name: model.get('classGroup.name'),
            ...this.getAttrMap()
        };
        data.parent = model.get('parent.name');
        data.actionBinder = result.actionBinder;
        const overridden = model.getBehavior('overridden');
        const names = overridden.getInheritedAttrNames();
        ObjectHelper.deleteProperties(names, data);
        ObjectHelper.deleteProperties([model.PK, 'view', 'classGroup', 'overriddenState'], data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');