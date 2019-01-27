const { getConfig } = require('./config-handler');
const { startContainers } = require('./docker-containers');
const { bootstrap } = require('./bootstrap');

async function run(configPath) {

    const config = await getConfig(configPath);

    await startContainers(config);
    const env = await bootstrap(config.bootstrap);
    return env;
}


module.exports = {
    run
};