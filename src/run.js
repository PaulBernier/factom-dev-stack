const { getConfig } = require('./config-handler');
const { startContainers, stopContainers } = require('./docker-containers');
const { bootstrap } = require('./bootstrap');
const chalk = require('chalk');

async function run(configPath) {

    const config = await getConfig(configPath);

    try {
        await startContainers(config);
        await bootstrap(config.bootstrap);
    } catch (e) {
        console.error(chalk.red(e.message));
        await stopContainers();
    }
}


module.exports = {
    run
};