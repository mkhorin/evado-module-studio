/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ParamContainerBase extends Base {

    async prepareModels (models) {
        await ParamContainer.resolveRelation('param', models);
        for (const model of models) {
            let param = model.rel('param');
            if (param) {
                await param.prepareData();
                param = param.stringify();                
            } else {
                param = '';
            }
            model.setViewAttr('param', param);
            model.setAttrValueLabel('type');
        }
    }
};

const ParamContainer = require('../../../component/param/ParamContainer');