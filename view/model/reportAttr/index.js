/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportAttrIndex extends Base {

    async resolveTemplateData () {
        const reportQuery = this.spawn('model/Report').findForSelect();
        const reports = await SelectHelper.queryItems(reportQuery);
        return {reports};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');