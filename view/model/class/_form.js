/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        return {
            forbiddenView: await model.resolveRelation('forbiddenView'),
            key: await model.resolveRelation('key'),
            parent: await model.resolveRelation('parent'),
            version: await model.resolveRelation('version')
        };
    }
};