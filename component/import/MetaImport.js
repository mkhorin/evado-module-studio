/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class MetaImport extends Base {

    static getConstants () {
        return {
            RULES: super.RULES.concat([
                ['source', 'default', {value: 'app'}]
            ])
        };
    }

    async validateSource (attr) {
        this.basePath = this.getSourcePath();
        const stat = await FileHelper.getStat(this.basePath);        
        if (!stat || !stat.isDirectory()) {
            this.addError(attr, 'Invalid directory');
        }
    }

    async validateData () {
        if (!this.hasError()) {
            await this.createClasses();
        }
        if (!this.hasError()) {
            await this.createReports();
        }
        if (!this.hasError()) {
            await this.createSections();
        }
    }

    assignError (message) {
        if (message) {
            this.addError(this.Helper.trimConstructorName(this), message);
        }
    }

    async deleteOnError () {
        if (this.hasError()) {
            await this.deleteImports(this.classImports);
            await this.deleteImports(this.reportImports);
            await this.deleteImports(this.sectionImports);
            this.log('error', 'Import error', this.getErrors());
        }
    }

    async deleteImports (items) {
        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.model) {
                    await item.model.delete();
                }
            }
        }
    }

    // CLASSES

    getClass (id) {
        return ObjectHelper.getValue(id, this.classMap);
    }

    getClassByName (name) {
        return ObjectHelper.getValue(name, this.classMapByName);
    }

    async resolveClassMap () {
        if (!this.classMap) {
            const model = this.spawn('model/Class');
            this.classMap = await model.find().with('attrMap', 'viewMap').indexByKey().all();
            this.classMapByName = IndexHelper.indexModels(Object.values(this.classMap), 'name');
        }
    }

    async createClasses () {
        const dir = path.join(this.basePath, 'base/class');
        let files = await FileHelper.readDirectory(dir);
        files = FileHelper.filterJsonFiles(files);
        files = await this.sortClassFiles(files, dir); // sort classes for inheritance
        this.classImports = [];
        for (const file of files) {
            await this.createClass(path.join(dir, file));
        }
    }

    async sortClassFiles (files, dir) {
        let items = [];
        for (const file of files) {
            items.push(await this.parseClassFile(file, dir));
        }
        items = ArrayHelper.sortHierarchy(items, 'name', 'parent');
        return items.map(item => item._fileName);
    }

    async parseClassFile (file, dir) {
        try {
            const data = await FileHelper.readJsonFile(path.join(dir, file));
            data.name = FileHelper.getBasename(file);
            data._fileName = file;
            return data;
        } catch (err) {
            throw new Error(`Invalid class file: ${file}: ${err}`);
        }
    }

    async createClass (file) {
        const model = this.spawn('import/ClassImport', {meta: this, file});
        this.classImports.push(model);
        model.set('source', file);
        await model.process();
        this.assignError(this.Helper.getError(model, `Class: ${path.basename(file)}`));
    }

    // REPORT

    getReportByName (name) {
        return ObjectHelper.getValue(name, this.reportMapByName);
    }

    async resolveReportMap () {
        if (!this.reportMapByName) {
            this.reportMapByName = await this.spawn('model/Report').find().with('attrMap').index('name').all();
        }
    }

    async createReports () {
        const dir = path.join(this.basePath, 'report');
        const files = await FileHelper.readDirectory(dir);
        this.reportImports = [];
        for (const file of FileHelper.filterJsonFiles(files)) {
            await this.createReport(path.join(dir, file));
        }
    }

    async createReport (file) {
        const model = this.spawn('import/ReportImport', {meta: this, file});
        model.set('source', FileHelper.trimExtension(file));
        this.reportImports.push(model);
        model.set('source', file);
        await model.process();
        this.assignError(this.Helper.getError(model, `Report: ${path.basename(file)}`));
    }

    // NAVIGATION

    async createSections () {
        const dir = path.join(this.basePath, 'navigation');
        const files = await FileHelper.readDirectory(dir);
        this.sectionImports = [];
        for (const file of FileHelper.filterJsonFiles(files)) {
            await this.createSection(path.join(dir, file));
        }
    }

    async createSection (file) {
        const model = this.spawn('import/SectionImport', {meta: this, file});
        model.set('source', FileHelper.trimExtension(file));
        this.sectionImports.push(model);
        model.set('source', file);
        await model.process();
        this.assignError(this.Helper.getError(model, `Section: ${file}`));
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        if (this.hasError()) {
            return false;
        }
        await this.resolveClassMap();
        await this.processDeferredBindingModels(this.classImports, 'Class');
        await this.processDeferredBindingModels(this.reportImports, 'Report');
        await this.processDeferredBindingModels(this.sectionImports, 'Section');
        await this.deleteOnError();
        await PromiseHelper.setImmediate();
    }

    async processDeferredBindingModels (models, prefix) {
        for (const model of models) {
            if (!this.hasError()) {
                await model.processDeferredBinding();
                this.assignError(this.Helper.getError(model, `${prefix}: ${model.baseName}`));
            }
        }
    }
};
module.exports.init(module);

const path = require('path');
const ArrayHelper = require('areto/helper/ArrayHelper');
const FileHelper = require('areto/helper/FileHelper');
const IndexHelper = require('areto/helper/IndexHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');