/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ParamContainerExport');

module.exports = class BehaviorContainerExport extends Base {

    getParamHandler (model) {
        switch (model.constructor.name) {
            case 'FileParam':
                return this.getFileData.bind(this);
            case 'S3Param':
                return this.getS3Data.bind(this);
            case 'SignatureParam':
                return this.getSignatureData.bind(this);
            case 'TimestampParam':
                return this.getTimestampData.bind(this);
        }
    }

    getFileData (model) {
        return this.spawn('export/FileBehaviorExport', {model}).execute();
    }

    getS3Data (model) {
        return this.spawn('export/S3BehaviorExport', {model}).execute();
    }

    getSignatureData (model) {
        return this.spawn('export/SignatureBehaviorExport', {model}).execute();
    }

    getTimestampData (model) {
        return this.spawn('export/TimestampBehaviorExport', {model}).execute();
    }
};