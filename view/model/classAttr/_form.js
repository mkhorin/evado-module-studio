/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassAttrForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        await model.resolveRelation('class');
    }
};