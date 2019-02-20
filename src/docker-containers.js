const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

const FACTOMD_CONTAINER_NAME = 'fds-factomd';
const WALLETD_CONTAINER_NAME = 'fds-walletd';

async function startContainers(config) {
    console.error('Starting containers...');

    const commands = [buildFactomdCommand(config.factomd), buildWalletdCommand(config.walletd)];

    await Promise.all(commands.map(c => exec(c)));
    console.error('factomd and factom-walletd instances running');
}

function buildFactomdCommand(factomd) {
    let cmd = `docker run -d --rm --name "${FACTOMD_CONTAINER_NAME}" -p "8088:8088" -p "8090:8090" `;

    if (factomd.conf) {
        cmd += ` -v ${path.dirname(factomd.conf)}:/factomd-config `;
    }

    cmd += `${factomd.image} -startdelay=0 -faulttimeout=0 -network=LOCAL`;
    if (factomd.conf) {
        cmd += ` -config /factomd-config/${path.basename(factomd.conf)}`;
    }
    if (factomd.blockTime) {
        cmd += ` -blktime=${factomd.blockTime}`;
    }

    return cmd;
}

function buildWalletdCommand(walletd) {
    let cmd = `docker run -d --rm --name "${WALLETD_CONTAINER_NAME}" -p "8089:8089" ${walletd.image}`;
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

