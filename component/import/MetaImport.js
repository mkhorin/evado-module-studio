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
        if (stat && !stat.isDirectory()) {
            this.addError(attr, `Invalid directory: ${this.basePath}`);
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
            const query = model.find().with('attrMap', 'viewMap');
            this.classMap = await query.indexByKey().all();
            const models = Object.values(this.classMap);
            this.classMapByName = IndexHelper.indexModels(models, 'name');
        }
    }

    async createClasses () {
        const dir = path.join(this.basePath, 'base/class');
        let names = await FileHelper.readDirectory(dir);
        names = FileHelper.filterJsonFiles(names);
        names = await this.sortClassFiles(names, dir); // sort for inheritance
        this.classImports = [];
        for (const name of names) {
            const file = path.join(dir, name);
            await this.createClass(file);
        }
    }

    async sortClassFiles (names, dir) {
        let items = [];
        for (const name of names) {
            const item = await this.parseClassFile(name, dir);
            items.push(item);
        }
        items = ArrayHelper.sortHierarchy(items, 'name', 'parent');
        return items.map(item => item._filename);
    }

    async parseClassFile (name, dir) {
        try {
            const file = path.join(dir, name);
            const data = await FileHelper.readJsonFile(file);
            data.name = FileHelper.getBasename(name);
            data._filename = name;
            return data;
        } catch (err) {
            throw new Error(`Invalid class file: ${name}: ${err}`);
        }
    }

    async createClass (file) {
        const instance = this.spawn('import/ClassImport', {meta: this, file});
        this.classImports.push(instance);
        instance.set('source', file);
        await instance.process();
        const name = path.basename(file);
        const error = this.Helper.getError(instance, `Class: ${name}`);
        this.assignError(error);
    }

    // REPORT

    getReportByName (name) {
        return ObjectHelper.getValue(name, this.reportMapByName);
    }

    async resolveReportMap () {
        if (!this.reportMapByName) {
            const query = this.spawn('model/Report').find().with('attrMap');
            this.reportMapByName = await query.index('name').all();
        }
    }

    async createReports () {
        const dir = path.join(this.basePath, 'report');
        const names = await FileHelper.readDirectory(dir);
        this.reportImports = [];
        for (const name of FileHelper.filterJsonFiles(names)) {
            const file = path.join(dir, name);
            await this.createReport(file);
        }
    }

    async createReport (file) {
        const instance = this.spawn('import/ReportImport', {meta: this, file});
        instance.set('source', FileHelper.trimExtension(file));
        this.reportImports.push(instance);
        instance.set('source', file);
        await instance.process();
        const name = path.basename(file);
        const error = this.Helper.getError(instance, `Report: ${name}`);
        this.assignError(error);
    }

    // NAVIGATION

    async createSections () {
        const dir = path.join(this.basePath, 'navigation');
        const names = await FileHelper.readDirectory(dir);
        this.sectionImports = [];
        for (const name of FileHelper.filterJsonFiles(names)) {
            const file = path.join(dir, name);
            await this.createSection(file);
        }
    }

    async createSection (file) {
        const instance = this.spawn('import/SectionImport', {meta: this, file});
        instance.set('source', FileHelper.trimExtension(file));
        this.sectionImports.push(instance);
        instance.set('source', file);
        await instance.process();
        this.assignError(this.Helper.getError(instance, `Section: ${file}`));
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
                const error = this.Helper.getError(model, `${prefix}: ${model.baseName}`);
                this.assignError(error);
            }
        }
    }
};
module.exports.init(module);

const ArrayHelper = require('areto/helper/ArrayHelper');
const FileHelper = require('areto/helper/FileHelper');
const IndexHelper = require('areto/helper/IndexHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');
const path = require('path');