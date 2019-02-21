const { getConfig } = require('./config-handler');
const { startContainers, stopContainers } = require('./docker-containers');
const { bootstrap } = require('./bootstrap');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const chalk = require('chalk');

async function run(configs) {

    const config = getConfig(configs);
    const sbs = await shouldBootstrap(config);
    await startContainers(config);

    let env = {};
    if (sbs) {
        env = await bootstrap(config.bootstrap);
    }

    console.error(chalk.green('\nFactom Dev Start running.\n'));
    return env;
}

async function stop() {
    await stopContainers();
    console.error(chalk.green('\nFactom Dev Start stopped.\n'));
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
    run,
    stop
};