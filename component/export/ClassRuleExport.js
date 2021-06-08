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
        data.attrs = data.attrs.length ? data.attrs : undefined;
        return data;
    }

    getRuleContainerData (model) {
        return this.spawn(RuleContainerExport, {model}).execute();
    }
};

const RuleContainerExport = require('./RuleContainerExport');