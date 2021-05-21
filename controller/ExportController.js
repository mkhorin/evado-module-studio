/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseController');

module.exports = class ExportController extends Base {

    async actionMeta () {
        this.checkCsrfToken();
        return this.createExporter('Export metadata', async exporter => {
            await exporter.exportMeta();
            await this.renderResult('Metadata exported', exporter);
        });
    }

    async actionClass () {
        this.checkCsrfToken();
        const model = await this.getModel({
            Class: this.getClass('model/Class')
        });
        return this.createExporter('Export class', async exporter => {
            await exporter.exportClass(model);
            await this.renderResult('Class exported', exporter);
        });
    }

    async actionView () {
        this.checkCsrfToken();
        const model = await this.getModel({
            Class: this.getClass('model/View')
        });
        return this.createExporter('Export view', async exporter => {
            await exporter.exportView(model);
            await this.renderResult('View exported', exporter);
        });
    }

    async actionSection () {
        this.checkCsrfToken();
        const model = await this.getModel({
            Class: this.getClass('model/Section')
        });
        return this.createExporter('Export navigation section', async exporter => {
            await exporter.exportSection(model);
            await this.renderResult('Navigation section exported', exporter);
        });
    }

    async actionReport () {
        this.checkCsrfToken();
        const model = await this.getModel({
            Class: this.getClass('model/Report')
        });
        return this.createExporter('Export report', async exporter => {
            await exporter.exportReport(model);
            await this.renderResult('Report exported', exporter);
        });
    }

    renderResult (message, exporter) {
        return this.render('result', {
            message: this.translate(message),
            errors: exporter.meta.logger.errors
        });
    }

    async createExporter (title, handler) {
        const model = this.spawn('export/ExportModel');
        await model.setDefaultValues();
        if (this.isGetRequest()) {
            return this.render('meta', {title, model});
        }
        await model.load(this.getPostParams()).validate();
        if (model.hasError()) {
            return this.handleError(model);
        }
        return handler(this.spawn('export/Exporter', {
            basePath: model.basePath
        }));
    }
};
module.exports.init(module);