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

    resolve(config, 'factomdConf', dirname);
    resolve(config.bootstrap, 'script', dirname);
    resolve(config.bootstrap, 'scriptjs', dirname);
    resolve(config.bootstrap, 'wallet', dirname);
}

function resolve(config, attribute, dirname) {
    if (config && config[attribute]) {
        config[attribute] = path.resolve(dirname, config[attribute]);
    }
}

module.exports = {
    getConfig
};