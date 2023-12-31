/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ReportExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        const data = await this.getData();
        return this.saveJson(this.getReportFile(), data);
    }

    getReportFile () {
        const name = this.model.get('name');
        return this.getReportPath(`${name}.json`);
    }

    async getData () {
        const {model} = this;
        await model.resolveRelations(['attrs']);
        const data = this.getAttrMap();
        const attrs = model.rel('attrs');
        data.attrs = await PromiseHelper.map(attrs, this.getAttrData, this);
        data.attrs = data.attrs.filter(v => v);
        ObjectHelper.deleteProperties([model.PK, 'name'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    getAttrData (model) {
        return this.spawn('export/ReportAttrExport', {model}).execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');