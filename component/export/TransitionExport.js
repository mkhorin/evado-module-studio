/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class TransitionExport extends Base {

    async execute () {
        await this.model.resolveRelations(['startStates', 'finalState']);
        return this.getData();
    }

    getData () {
        const State = this.getClass('model/State');
        const map = this.class.rel('stateMap');
        const starts = this.model.get('startStates');
        const final = map[this.model.get('finalState')];
        const data = this.getAttrMap();
        data.startStates = starts
            .filter(id => map[id] instanceof State)
            .map(id => map[id].get('name'));
        data.finalState = final instanceof State ? final.get('name') : null;
        ObjectHelper.deleteProperties([this.model.PK, 'class'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');