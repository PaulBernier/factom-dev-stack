const fs = require('fs'),
    path = require('path');
const DEFAULT_CONFIG = require('./default-config.json');

async function getConfig(configFilePath) {

    let userConfig = {};
    try {
        userConfig = JSON.parse(fs.readFileSync(configFilePath));
        resolveConfigPaths(configFilePath, userConfig);
    } catch (e) {
        // 
    }

    return Object.assign({ ...DEFAULT_CONFIG }, userConfig);
}

function resolveConfigPaths(configFilePath, config) {
    const dirname = path.dirname(configFilePath);

    if (config.factomdConf) {
        config.factomdConf = path.resolve(dirname, config.factomdConf);
    }

    if (config.bootstrap && config.bootstrap.script) {
        config.bootstrap.script = path.resolve(dirname, config.bootstrap.script);
    }
    if (config.bootstrap && config.bootstrap.scriptjs) {
        config.bootstrap.scriptjs = path.resolve(dirname, config.bootstrap.scriptjs);
    }
}

module.exports = {
    getConfig
};