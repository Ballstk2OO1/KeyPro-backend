const NodeCache = require('node-cache')
const Switches = require('../models/switch_schema')

const switchCache = new NodeCache({ stdTTL: 604800 }) //7วัน

const getAllData = async () => {

    if (switchCache.has('switch')) {
        return switchCache.get('switch')
    }

    try {
        const data = await Switches.find()
        switchCache.set('switch', data)
        return data
    } catch (e) {
        return '500'
    }

}

exports.getAllData = getAllData