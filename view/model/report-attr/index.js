/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportAttrIndex extends Base {

    async resolveTemplateData () {
        return {            
            reports: await SelectHelper.queryItems(this.spawn('model/Report').findForSelect())
        };
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');