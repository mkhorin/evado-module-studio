/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Model');

module.exports = class ImportModel extends Base {

    static getConstants () {
        return {
            RULES: [
                ['source', 'required'],
                ['source', 'regex', {
                    pattern: /^[a-z0-9]{1}[a-z0-9-/]*$/i,
                    when: model => !model.file
                }],
                ['source', 'validateSource', {skipOnEmpty: false}],
                ['source', 'validateData', {skipOnEmpty: false}]
            ]
        };
    }

    constructor (config) {
        super({
            Helper: config.module.getClass('import/ImportHelper'),
            ...config
        });
    }

    async isSource () {
        return (await FileHelper.getStat(this.getSourcePath())).isD;
    }

    getSourcePath () {
        return this.module.app.getPath('metadata/' + this.get('source'));
    }

    assignError (message) {
        if (message) {
            this.addError(this.Helper.trimConstructorName(this), `${this.data.name}: ${message}`);
        }
    }

    async process () {
        await this.validate();
        await this.deleteOnError();
    }

    async processDeferredBinding () {
    }

    async processDeferredBindingModels (models) {
        for (const model of models) {
            if (!this.hasError()) {
                await model.processDeferredBinding();
                this.assignError(this.Helper.getError(model));
            }
        }
    }

    async validateSource (attr) {
        try {
            this.file = this.file || `${this.getSourcePath()}.json`;
            this.data = await FileHelper.readJsonFile(this.file);
            this.baseName = FileHelper.getBasename(this.file);
        } catch {
            this.data = {};
            this.addError(attr, `Invalid source`);
        }
    }

    deleteOnError () {
        if (this.hasError()) {
            this.log('error', 'Model import error', this.getErrors());
            return this.model?.delete();
        }
    }

    async save () {
        if (!this.hasError()) {
            await this.model.save();
            this.assignError(this.Helper.getError(this.model));
        }
    }
};
module.exports.init();

const FileHelper = require('areto/helper/FileHelper');