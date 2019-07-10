const fs = require('fs'),
    chalk = require('chalk'),
    path = require('path'),
    merge = require('deepmerge');

const DEFAULT_CONFIG = require('./default-config.json');

function getConfig({ configPath = '.', flagConfig = {} }) {
    console.error(chalk.yellow('\nLoading Factom Dev Stack configuration...'));
    let userConfig = {};
    try {
        const configFilePath = getConfigFilePath(configPath);
        userConfig = JSON.parse(fs.readFileSync(configFilePath));
        console.error(`* Loading ${configFilePath}`);
        resolveConfigPaths(configFilePath, userConfig);
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error('No factom-dev-stack config file found.');
        } else {
            console.error(e);
        }
    }

    return merge.all([DEFAULT_CONFIG, userConfig, flagConfig]);
}

function getConfigFilePath(configFilePath) {
    if (fs.statSync(configFilePath).isDirectory()) {
        return path.join(configFilePath, '.factomds.json');
    } else {
        return configFilePath;
    }
}

function resolveConfigPaths(configFilePath, config) {
    const dirname = path.dirname(configFilePath);

    resolve(config.factomd, 'conf', dirname);
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
