/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassRuleExport extends Base {

    async execute () {
        await this.model.resolveRelation('attrs');
        const data = await this.getRuleContainerData(this.model);
        data.attrs = this.model.get('attrs.name');
        return data.attrs.length ? data : null;
    }

    getRuleContainerData (model) {
        return this.spawn(RuleContainerExport, {model}).execute();
    }
};

const RuleContainerExport = require('./RuleContainerExport');