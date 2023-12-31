/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class TreeViewLevelForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const sourceClass = await model.findSourceClass();
        const refAttrs = sourceClass ? await this.getRefAttrs(sourceClass) : [];
        await model.resolveRelation('view');
        return {refAttrs, sourceClass};
    }

    getRefAttrs (source) {
        const query = this.spawn('model/ClassAttr').findForSelect(source.getId());
        query.and({type: ['ref', 'backref']});
        return SelectHelper.queryLabelItems(query);
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');