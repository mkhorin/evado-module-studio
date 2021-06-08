/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ParamExport');

module.exports = class FileBehaviorExport extends Base {

    async execute () {
        await this.model.prepareData();
        this.split('extensions');
        this.split('types');
        this.model.set('nameAttr', this.model.get('nameAttr.name'));
        return super.execute();
    }

    split (attr) {
        const value = StringHelper.split(this.model.get(attr));
        this.model.set(attr, value.length ? value : undefined);
    }
};

const StringHelper = require('areto/helper/StringHelper');