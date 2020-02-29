/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/validator/RegexValidator');

module.exports = class AttrNameValidator extends Base {

    constructor (config) {
        super({
            pattern: /^_{0,1}[0-9a-zA-Z-]{2,40}$/,
            ...config
        });
    }
};