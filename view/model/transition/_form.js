/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class TransitionForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        await model.resolveRelations(['class', 'finalState']);
    }
};