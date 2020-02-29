/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewForm extends Base {

    async resolveTemplateData () {
        return {
            class: await this.data.model.resolveRelation('class')
        };
    }
};