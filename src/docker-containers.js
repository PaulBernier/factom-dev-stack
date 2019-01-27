const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

const FACTOMD_CONTAINER_NAME = 'fds-factomd';
const WALLETD_CONTAINER_NAME = 'fds-walletd';

async function startContainers(config) {
    console.error('Starting containers...');

    const commands = [buildFactomdCommand(config), buildWalletdCommand(config)];

    await Promise.all(commands.map(c => exec(c)));
}

function buildFactomdCommand(config) {
    let cmd = `docker run -d --rm --name "${FACTOMD_CONTAINER_NAME}" -p "8088:8088" -p "8090:8090" `;

    if (config.factomdConf) {
        cmd += ` -v ${path.dirname(config.factomdConf)}:/factomd-config `;
    }

    cmd += `${config.factomdImage} -startdelay=0 -faulttimeout=0 -network=LOCAL`;
    if (config.factomdConf) {
        cmd += ` -config /factomd-config/${path.basename(config.factomdConf)}`;
    }

    return cmd;
}

function buildWalletdCommand(config) {
    let cmd = `docker run -d --rm --name "${WALLETD_CONTAINER_NAME}" -p "8089:8089" `;
    cmd += `${config.walletdImage}`;
    return cmd;
}

async function stopContainers() {
    console.error('Stopping containers...');
    try {
        await Promise.all([exec('docker stop fds-factomd'), exec('docker stop fds-walletd')]);
    } catch (e) {
        if (!e.message.includes('No such container')) {
            throw e;
        }
    }
}

module.exports = {
    startContainers,
    stopContainers
};

