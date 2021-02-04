/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseController');

module.exports = class ImportController extends Base {

    getModelClass () {
        return this.getClass('import/MetaImport');
    }

    async actionMeta () {
        this.checkCsrfToken();
        const model = this.createModel();
        if (this.isGetRequest()) {
            await model.setDefaultValues();
            return this.renderForm('Import metadata', model, {
                alert: 'All studio data will be overwritten'
            });
        }
        await this.module.dropAll();
        return this.processModel(model, 'Metadata imported');
    }

    async actionClass () {
        this.checkCsrfToken();
        const meta = this.createModel();
        const model = this.spawn('import/ClassImport', {meta});
        if (this.isGetRequest()) {
            await model.setDefaultValues();
            return this.renderForm('Import class', model);
        }
        return this.processModel(model, 'Class imported');
    }

    async actionView () {
        this.checkCsrfToken();
        const meta = this.createModel();
        const classModel = await this.getModel({
            Class: this.getClass('model/Class')
        });
        const model = this.spawn('import/ViewImport', {meta, classModel});
        if (this.isGetRequest()) {
            await model.setDefaultValues();
            return this.renderForm('Import view', model);
        }
        return this.processModel(model, 'View imported');
    }

    async actionSection () {
        this.checkCsrfToken();
        const meta = this.createModel();
        const model = this.spawn('import/SectionImport', {meta});
        if (this.isGetRequest()) {
            await model.setDefaultValues();
            return this.renderForm('Import navigation section', model);
        }
        return this.processModel(model, 'Navigation section imported');
    }

    async actionReport () {
        this.checkCsrfToken();
        const meta = this.createModel();
        const model = this.spawn('import/ReportImport', {meta});
        if (this.isGetRequest()) {
            await model.setDefaultValues();
            return this.renderForm('Import report', model);
        }
        return this.processModel(model, 'Report imported');
    }

    renderForm (title, model, params) {
        return this.render('meta', {title, model, ...params});
    }

    async processModel (model, message) {
        model.load(this.getPostParams());
        await model.process();
        if (model.hasError()) {
            return this.handleError(model);
        }
        await model.processDeferredBinding();
        model.hasError()
            ? this.handleError(model)
            : this.send(message);
    }
};
module.exports.init(module);