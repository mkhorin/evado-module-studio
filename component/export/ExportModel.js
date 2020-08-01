/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Model');

module.exports = class ExportModel extends Base {

    static getConstants () {
        return {
            RULES: [
                ['target', 'required'],
                ['target', 'regex', {pattern: /^[a-z0-9]{1}[a-z0-9-/]*$/i}],
                ['target', 'validateTarget'],
                ['target', 'default', {value: 'app'}]
            ]
        };
    }

    getMetadataDirectory () {
        return 'metadata/' + this.get('target');
    }

    async validateTarget (attr) {
        try {
            this.basePath = this.module.app.getPath(this.getMetadataDirectory());
            await FileHelper.createDirectory(this.basePath);
        } catch (err) {
            this.addError(attr, err.toString());
        }
    }
};
module.exports.init(module);

const FileHelper = require('areto/helper/FileHelper');