/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseModule');

module.exports = class StudioModule extends Base {

    static getConstants ()  {
        return {
            BEHAVIORS: {
                'access': {
                    Class: require('areto/filter/AccessControl'),
                    rules: [{
                        permissions: ['moduleStudio']
                    }]
                }
            }
        };
    }

    constructor (config) {
        super({
            defaultViewLayout: '_layout/content',
            ...config
        });
    }

    async dropAll () {
        const classes = [
            'component/Param',
            'component/ParamContainer',
            'model/ActionBinder',
            'model/AttrBehavior',
            'model/AttrRule',
            'model/Class',
            'model/ClassAttr',
            'model/ClassBehavior',
            'model/ClassGroup',
            'model/ClassIndex',
            'model/ClassIndexAttr',
            'model/ClassRule',
            'model/Enum',
            'model/EnumItem',
            'model/Node',
            'model/Report',
            'model/ReportAttr',
            'model/Section',
            'model/State',
            'model/Transition',
            'model/TreeViewLevel',
            'model/Via',
            'model/View',
            'model/ViewAttr',
            'model/ViewAttrBehavior',
            'model/ViewAttrRule',
            'model/ViewBehavior',
            'model/ViewGroup',
            'model/ViewRule'
        ];
        for (const key of classes) {
            await this.getDb().drop(this.getClass(key).TABLE);
        }
    }

    async importMeta (source = 'app') {
        const model = this.spawn('import/MetaImport');
        model.set('source', source);
        await model.process();
        await model.processDeferredBinding();
        if (model.hasError()) {
            throw new Error(model.getFirstError());
        }
    }
};
module.exports.init(module);