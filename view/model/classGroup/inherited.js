/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./_form');

module.exports = class InheritedClassGroupForm extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        const {model} = this.data;
        const original = await model.resolveRelation('original');
        const overridden = await model.getBehavior('overridden').getAttrMap();
        return {...data, original, overridden};
    }
};