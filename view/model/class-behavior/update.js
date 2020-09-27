/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../attr-behavior/update');

module.exports = class ClassBehaviorUpdate extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        await this.resolveModelRelations(data.paramModelMap, {
            file: ['nameAttr']
        });
        return data;
    }
};