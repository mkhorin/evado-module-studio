/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Base');

module.exports = class BaseExport extends Base {

    static parseJsonAttrs (model) {
        const data = {...model.getAttrMap()};
        const validators = [
            ...model.getValidatorsByClass(JsonValidator),
            ...model.getValidatorsByClass(SpawnValidator)
        ];
        for (const {attrs} of validators) {
            for (const attr of attrs) {
                const value = data[attr];
                if (value && typeof value === 'string') {
                    data[attr] = JSON.parse(value);
                }
            }
        }
        return data;
    }

    async execute () {
        if (this.model) {
            const data = this.getAttrMap();
            ObjectHelper.deleteProperties([this.model.PK], data);
            ObjectHelper.deleteEmptyProperties(data);
            return data;
        }
    }

    getNavigationPath () {
        return this.getPath(this.exporter.navigationDirectory, ...arguments);
    }

    getClassPath () {
        return this.getPath(this.exporter.classDirectory, ...arguments);
    }

    getViewPath () {
        return this.getPath(this.exporter.viewDirectory, ...arguments);
    }

    getReportPath () {
        return this.getPath(this.exporter.reportDirectory, ...arguments);
    }

    getPath () {
        return this.exporter.getPath(...arguments);
    }

    saveJson () {
        return this.exporter.saveJsonFile(...arguments);
    }

    getActionBinderData (model) {
        return this.spawn('export/ActionBinderExport', {model}).execute();
    }

    getAttrMap () {
        return this.constructor.parseJsonAttrs(this.model);
    }

    getViaMap () {
        return this.spawn('model/Via').getMap();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const JsonValidator = require('areto/validator/JsonValidator');
const SpawnValidator = require('areto/validator/SpawnValidator');