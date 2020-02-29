/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ClassGroupImport');

module.exports = class InheritedClassGroupImport extends Base {

    process () {
        this.model.getBehavior('overridden').setStatesByData(this.data);
        return this.processAfter();
    }
};
module.exports.init(module);