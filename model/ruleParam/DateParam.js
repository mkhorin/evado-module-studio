/**
 * @copyright Copyright (c) 2022 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class DateParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'max',
                'maxExpression',
                'min',
                'minExpression',
                'tooBig',
                'tooSmall',
                'format'
            ]),
            RULES: super.RULES.concat([
                [['max', 'min', 'tooBig', 'tooSmall'], 'string'],
                [['maxExpression', 'minExpression'], 'json'],
                ['format', 'default', {value: 'date'}]
            ]),
            ATTR_LABELS: {
                max: 'Maximum date',
                maxExpression: 'Maximum date expression',
                min: 'Minimum date',
                minExpression: 'Minimum date expression',
                tooBig: 'Too big message',
                tooSmall: 'Too small message'
            },
            FORMAT_VALUE_LABELS: {
                date: 'Date',
                datetime: 'Date and time',
                timestamp: 'Timestamp'
            }
        };
    }
};
module.exports.init(module);