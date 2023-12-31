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
        const {exporter} = this;
        const classExport = this.spawn('export/ClassExport', {exporter, model, viaMap});
        await classExport.execute();
        const children = await model.resolveRelation('children');
        for (const child of children) {
            await this.exportClass(child, viaMap);
        }
    }
};