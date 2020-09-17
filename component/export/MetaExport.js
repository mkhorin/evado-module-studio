/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class MetaExport extends Base {

    async execute () {
        const viaMap = await this.getViaMap();
        const classes = await this.spawn('model/Class').createQuery().with('attrs').all();
        const reports = await this.spawn('model/Report').createQuery().with('attrs').all();
        const sections = await this.spawn('model/Section').createQuery().with('module').all();
        const nodeMap = await this.spawn('model/Node').getMap();
        await this.createDirectory();
        for (const item of classes) {
            await this.exportClass(item, viaMap);
        }
        for (const item of reports) {
            await this.exportReport(item);
        }
        for (const item of sections) {
            await this.exportSection(item, nodeMap);
        }
    }

    async createDirectory () {
        await FileHelper.createDirectory(this.getPath());
        await this.emptyDirectory(this.getClassPath());
        await this.emptyDirectory(this.getViewPath());
        await this.emptyDirectory(this.getNavigationPath());
        await this.emptyDirectory(this.getReportPath());
    }

    async emptyDirectory (name) {
        await FileHelper.createDirectory(name);
        await FileHelper.emptyDirectory(name);
    }

    exportClass (model, viaMap) {
        const exporter = this.exporter;
        return this.spawn('export/ClassExport', {exporter, model, viaMap}).execute();
    }

    exportReport (model) {
        const exporter = this.exporter;
        return this.spawn('export/ReportExport', {exporter, model}).execute();
    }

    exportSection (model, nodeMap) {
        const exporter = this.exporter;
        return this.spawn('export/SectionExport', {exporter, model, nodeMap}).execute();
    }
};

const FileHelper = require('areto/helper/FileHelper');