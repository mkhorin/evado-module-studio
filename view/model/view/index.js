/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewIndex extends Base {

    async resolveTemplateData () {
        const classQuery = this.spawn('model/Class').findForSelect();
        return {
            classes: await SelectHelper.queryItems(classQuery)
        };
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');