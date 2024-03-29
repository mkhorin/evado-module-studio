/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/validator/Validator');

module.exports = class CodeNameValidator extends Base {

    constructor (config) {
        super({
            pattern: /^[0-9a-zA-Z-]{1,40}$/,
            trimming: true,
            validFilename: false,
            ...config
        });
    }

    getMessage () {
        return this.createMessage(this.message, 'Invalid code name');
    }

    validateAttr (attr, model) {
        let value = model.get(attr);
        if (typeof value === 'string') {
            if (this.trimming) {
                value = value.trim();
            }
            model.set(attr, value);
        }
        return super.validateAttr(attr, model);
    }

    validateValue (value) {
        if (typeof value !== 'string') {
            return this.getMessage();
        }
        if (!this.pattern.test(value)) {
            return this.getMessage();
        }
        if (this.validFilename) {
            if (RegexValidator.PATTERNS.reservedFilenameChars.test(value)) {
                return this.getMessage();
            }
            if (RegexValidator.PATTERNS.reservedWindowsFilename.test(value)) {
                return this.getMessage();
            }
        }
    }
};

const RegexValidator = require('areto/validator/RegexValidator');