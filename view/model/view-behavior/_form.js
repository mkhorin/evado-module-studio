/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../attr-rule/_form');

module.exports = class ViewBehaviorForm extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        data.attrItems = data.owner
            ? SelectHelper.getModelLabelItems(data.owner.rel('attrs'))
            : [];
        return data;
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');