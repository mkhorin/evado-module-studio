/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelation('creationView');
        await model.resolveRelation('editView');
        return {
            original: await model.resolveRelation('original'),
            class: await model.resolveRelation('class')
        };
    }
};