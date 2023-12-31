/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassIndexForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        return {
            class: await model.resolveRelation('class')
        };
    }
};