/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrFilter extends Base {

    resolveTemplateData () {
        const ClassAttr = this.getClass('model/ClassAttr');
        return {
            viewTypes: ClassAttr.getAttrValueLabels('viewType')
        };
    }
};