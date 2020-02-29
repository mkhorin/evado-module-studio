/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewIndex extends Base {

    async resolveTemplateData () {
        return {
            classes: await SelectHelper.queryItems(this.spawn('model/Class').findForSelect())
        };
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');