/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ViewGroupExport extends Base {

    async execute () {
        await this.model.resolveRelations(['actionBinder', 'classGroup', 'parent']);
        return this.getData({
            actionBinder: await this.getActionBinderData(this.model.rel('actionBinder'))
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
        ObjectHelper.deleteProperties(overridden.getInheritedAttrNames(), data);
        ObjectHelper.deleteProperties([model.PK, 'view', 'classGroup', 'overriddenState'], data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');