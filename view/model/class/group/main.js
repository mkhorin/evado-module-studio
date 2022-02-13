/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassMainGroup extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        await model.resolveRelations([
            'forbiddenView',
            'key',
            'version'
        ]);
    }
};