const { getConfig } = require('./config-handler');
const { startContainers } = require('./docker-containers');
const { bootstrap } = require('./bootstrap');

async function run(configPath) {

    const config = await getConfig(configPath);

    await startContainers(config);
    await bootstrap(config.bootstrap);
}


module.exports = {
    run
};