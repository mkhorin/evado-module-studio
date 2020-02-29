/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class TreeViewExport extends Base {

    async execute () {
        const data = {
            refAttr: this.model.get('refAttr.name'),
            view: this.model.get('view.name'),
            recursive: this.model.get('recursive'),
            options: this.model.get('options')
        };
        ObjectHelper.deleteEmptyProperties(data);
        ObjectHelper.deletePropertiesByValue(false, data, ['recursive']);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');