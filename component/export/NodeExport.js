/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class NodeExport extends Base {

    execute () {
        const data = {
            ...this.getAttrMap()
        };
        const id = this.model.get('parent');
        data.parent = this.nodeMap.byId[id]?.get('name');
        data.class = this.model.get('class.name');
        data.view = this.model.get('view.name');
        data.report = this.model.get('report.name');
        ObjectHelper.deleteProperties([this.model.PK, 'section'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');