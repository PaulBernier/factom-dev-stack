const fs = require('fs'),
    path = require('path');
const DEFAULT_CONFIG = require('./default-config.json');

async function getConfig(configFilePath) {

    let userConfig = {};
    try {
        userConfig = JSON.parse(fs.readFileSync(configFilePath));
        resolveConfigPaths(configFilePath, userConfig);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error('No factom-dev-stack config file found.');
        } else {
            console.error(e);
        }
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
    if (config && typeof config[attribute] === 'string') {
        config[attribute] = path.resolve(dirname, config[attribute]);
    }
}

module.exports = {
    getConfig
};