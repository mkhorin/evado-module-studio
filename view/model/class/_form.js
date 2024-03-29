/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassForm extends Base {

     async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations([
            'forbiddenView',
            'key',
            'parent',
            'version'
        ]);
    }
};