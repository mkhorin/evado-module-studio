/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ParamContainerExport');

module.exports = class BehaviorContainerExport extends Base {

    getParamHandler (model) {
        switch (model.constructor.name) {
            case 'FileParam': return this.getFileData.bind(this);
            case 'TimestampParam': return this.getTimestampData.bind(this);
        }
    }

    getFileData (model) {
        return this.spawn('export/FileBehaviorExport', {model}).execute();
    }

    getTimestampData (model) {
        return this.spawn('export/TimestampBehaviorExport', {model}).execute();
    }
};