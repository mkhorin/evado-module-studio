/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ClassBranchExport extends Base {

    async execute () {
        const viaMap = await this.getViaMap();
        return this.exportClass(this.model, viaMap);
    }

    async exportClass (model, viaMap) {
        let exporter = this.exporter;
        await this.spawn('export/ClassExport', {exporter, model, viaMap}).execute();
        const children = await model.resolveRelation('children');
        for (const child of children) {
            await this.exportClass(child, viaMap);
        }
    }
};