/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportAttrForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const report = await model.resolveRelation('report');
        return {report};
    }
};