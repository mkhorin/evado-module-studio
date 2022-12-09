/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class Exporter extends Base {

    /**
     * @param {Object} config
     * @param {string} config.basePath - Meta base path
     */
    constructor (config) {
        super({
            jsonSpace: 2,
            jsonReplacer: null,
            jsonFileOptions: {},
            classDirectory: 'base/class',
            viewDirectory: 'base/view',
            navigationDirectory: 'navigation',
            reportDirectory: 'report',
            ...config
        });
        this.meta = this.module.getMetaHub();
    }

    getNavigationPath () {
        return this.getPath(this.navigationDirectory, ...arguments);
    }

    getClassPath () {
        return this.getPath(this.classDirectory, ...arguments);
    }

    getViewPath () {
        return this.getPath(this.viewDirectory, ...arguments);
    }

    getReportPath () {
        return this.getPath(this.reportDirectory, ...arguments);
    }

    getPath () {
        return path.join(this.basePath, ...arguments);
    }

    getHandler (model, config, params) {
        return () => {
            const instance = this.spawn(config, {
                exporter: this,
                model,
                ...params
            });
            return instance.execute();
        };
    }

    async exportMeta () {
        const handler = this.getHandler(null, 'export/MetaExport');
        await this.meta.process(handler, 'Meta export');
        await this.reload();
    }

    async exportClass (model) {
        const handler = this.getHandler(model, 'export/ClassBranchExport');
        await this.meta.process(handler, 'Class export');
        await this.reload();
    }

    async exportView (model) {
        const handler = this.getHandler(model, 'export/ViewExport');
        await this.meta.process(handler, 'View export');
        await this.reload();
    }

    async exportSection (model) {
        const handler = this.getHandler(model, 'export/SectionExport');
        await this.meta.process(handler, 'Navigation section export');
        await this.reload();
    }

    async exportReport (model) {
        const handler = this.getHandler(model, 'export/ReportExport');
        await this.meta.process(handler, 'Report export');
        await this.reload();
    }

    reload () {
        return this.meta.reload();
    }

    async saveJsonFile (file, data) {
        await FileHelper.createDirectory(path.dirname(file));
        data = JSON.stringify(data, this.jsonReplacer, this.jsonSpace);
        await fs.promises.writeFile(file, data);
    }
};
module.exports.init(module);

const FileHelper = require('areto/helper/FileHelper');
const fs = require('fs');
const path = require('path');