/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class ReportExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        return this.saveJson(this.getReportFile(), await this.getData());
    }

    getReportFile () {
        return this.getReportPath(`${this.model.get('name')}.json`);
    }

    async getData () {
        const model = this.model;
        await model.resolveRelations(['attrs']);
        const data = this.getAttrMap();
        data.attrs = await PromiseHelper.map(model.rel('attrs'), this.getAttrData, this);
        data.attrs = data.attrs.filter(item => item);
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