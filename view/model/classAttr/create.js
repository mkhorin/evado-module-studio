/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./_form');

module.exports = class CreateClassAttrForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        const names = model.scenario === 'clone'
            ? ['class', 'group', 'linkAttr', 'refClass', 'refAttr']
            : ['class'];
        await model.resolveRelations(names);
        return {};
    }
};