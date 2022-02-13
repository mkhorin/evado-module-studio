/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class ImportHelper {

    static assignAttrs (data, model) {
        if (data) {
            this.stringifyJson(data, model);
            model.assign(data);
        }
    }

    static stringifyJson (data, model) {
        const validators = [
            ...model.getValidatorsByClass(JsonValidator),
            ...model.getValidatorsByClass(SpawnValidator)
        ];
        for (const {attrs} of validators) {
            for (const attr of attrs) {
                if (Object.prototype.hasOwnProperty.call(data, attr)) {
                    const value = data[attr];
                    if (value !== '' && value !== null) {
                        data[attr] = JSON.stringify(value);
                    }
                }
            }
        }
    }

    static trimConstructorName (model) {
        const name = model.constructor.name;
        const index = name.lastIndexOf('Import');
        return index > 0 ? name.substring(0, index) :  name;
    }

    static getError (model, message) {
        if (!model) {
            return false;
        }
        const errors = model.getErrors();
        for (const key of Object.keys(errors)) {
            if (errors[key].length) {
                const error = model.module.translate(errors[key][0]);
                message = message ? `${message}: ` : '';
                return message + `Attribute: ${key}: ${error}`;
            }
        }
    }

    // PARAM

    static async importParamContainer (model, data, meta) {
        model.scenario = 'create';
        this.assignAttrs(data, model);
        await model.resolveRelation('param');
        if (!model.hasParam(data.type)) {
            return model.addError(model.constructor.name, `Invalid param type: ${data.type}`);
        }
        if (!await model.save()) {
            return;
        }
        const paramModel = model.getParamModel();
        if (!paramModel) {
            return;
        }
        this.assignAttrs(data, paramModel);
        await this.resolveRelations(paramModel, model, meta);
        if (!await paramModel.save()) {
            model.addError(model.constructor.name, `params: ${paramModel.getFirstError()}`);
        }
    }

    static getParamImportName (model, owner) {
        return model.constructor.name + owner.constructor.name;
    }

    static resolveRelations (model, owner, meta) {
        const customs = {
            FileParamClassBehavior: FileParamBehavior,
            S3ParamClassBehavior: S3ParamBehavior,
            SignatureParamClassBehavior: SignatureParamBehavior,
            TimestampParamClassBehavior: TimestampParamBehavior,
            SignatureParamViewBehavior: SignatureParamBehavior
        };
        const name = this.getParamImportName(model, owner);
        const cls = customs.hasOwnProperty(name) ? customs[name] : BaseParam;
        return owner.spawn(cls, {model, owner, meta}).execute();
    }

    // HIERARCHY

    static orderItemHierarchy (items) {
        const map = {}, list = [], roots = [];
        for (const item of items) {
            map[item.name] = {item};
        }
        for (const item of items) {
            if (map[item.parent]) {
                if (map[item.parent].children) {
                    map[item.parent].children.push(item);
                } else {
                    map[item.parent].children = [item];
                }
            } else {
                roots.push(item);
            }
        }
        this.fillHierarchyOrder(roots, list, map);
        return list;
    }

    static fillHierarchyOrder (items, list, map) {
        for (const item of items) {
            list.push(item);
            if (Array.isArray(map[item.name].children)) {
                this.fillHierarchyOrder(map[item.name].children, list, map);
            }
        }
    }
};

const JsonValidator = require('areto/validator/JsonValidator');
const SpawnValidator = require('areto/validator/SpawnValidator');
const BaseParam = require('./BaseParam');
const FileParamBehavior = require('./FileParamBehavior');
const S3ParamBehavior = require('./S3ParamBehavior');
const SignatureParamBehavior = require('./SignatureParamBehavior');
const TimestampParamBehavior = require('./TimestampParamBehavior');