/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/validator/Validator');

module.exports = class CodeNameValidator extends Base {

    constructor (config) {
        super({
            pattern: /^[0-9a-zA-Z-]{2,40}$/,
            validFilename: false,
            ...config
        });
    }

    getMessage () {
        return this.createMessage(this.message, 'Invalid code name');
    }

    validateValue (value) {
        if (typeof value !== 'string') {
            return this.getMessage();
        }
        if (!this.pattern.test(value)) {
            return this.getMessage();
        }
        const filename = RegexValidator.PATTERNS.reservedFileNameChars;
        const window = RegexValidator.PATTERNS.reservedWindowsFileName;
        if (this.validFilename && (filename.test(value) || window.test(value))) {
            return this.getMessage();
        }
    }
};

const RegexValidator = require('areto/validator/RegexValidator');