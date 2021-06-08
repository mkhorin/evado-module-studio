/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../attrBehavior/update');

module.exports = class ViewBehaviorUpdate extends Base {

    async resolveTemplateData () {
        const data = await super.resolveTemplateData();
        await this.resolveModelRelations(data.paramModelMap, {
            signature: ['signature']
        });
        return data;
    }
};