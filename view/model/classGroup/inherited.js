/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./_form');

module.exports = class InheritedClassGroupForm extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        const model = this.data.model;
        return Object.assign(data, {
            original: await model.resolveRelation('original'),
            overridden: await model.getBehavior('overridden').getAttrMap()
        });
    }
};