const { getConfig } = require('./config-handler');
const { startContainers } = require('./docker-containers');
const { bootstrap } = require('./bootstrap');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

async function run(configs) {

    const config = getConfig(configs);
    const sbs = await shouldBootstrap(config);
    await startContainers(config);

    if (sbs) {
        const env = await bootstrap(config.bootstrap);
        return env;
    } else {
        return {};
    }
}

async function shouldBootstrap(config) {
    if (config.persist) {
        // Bootstrap only on the first run
        const result = await exec(`docker volume ls --filter name="^fds-${config.persist}$"`);
        return !result.stdout.includes(config.persist);
    } else {
        return true;
    }
}

module.exports = {
    run
};