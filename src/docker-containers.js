const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');
const chalk = require('chalk');

const FACTOMD_CONTAINER_NAME = 'fds-factomd';
const WALLETD_CONTAINER_NAME = 'fds-walletd';

async function startContainers(config) {
    console.error(chalk.yellow('\nStarting services...'));

    const persistVolume = await getPersistVolume(config);
    const commands = [
        buildFactomdCommand(config.factomd, persistVolume),
        buildWalletdCommand(config.walletd, persistVolume)
    ];

    await Promise.all(commands.map(c => exec(c)));
    console.error(`* factomd instance started (${chalk.blue(config.factomd.image)})`);
    console.error(`* factom-walletd instance started (${chalk.blue(config.walletd.image)})`);
}

async function getPersistVolume(config) {
    if (config.persist) {
        const volumeName = `fds-${config.persist}`;
        await exec(`docker volume create --name=${volumeName} --label factom-dev-stack=true`);
        return ` -v "${volumeName}:/root/.factom"`;
    }
}

function buildFactomdCommand(factomd, persistVolume) {
    let cmd = `docker run -d --rm --name "${FACTOMD_CONTAINER_NAME}" -p "8088:8088" -p "8090:8090"`;

    if (factomd.conf) {
        cmd += ` -v ${path.dirname(factomd.conf)}:/factomd-config:ro`;
    }
    if (persistVolume) {
        cmd += persistVolume;
    }

    cmd += ` ${factomd.image} -startdelay=0 -faulttimeout=0 -network=LOCAL`;
    if (factomd.conf) {
        cmd += ` -config /factomd-config/${path.basename(factomd.conf)}`;
    }
    if (factomd.blockTime) {
        cmd += ` -blktime=${factomd.blockTime}`;
    }
    return cmd;
}

function buildWalletdCommand(walletd, persistVolume) {
    let cmd = `docker run -d --rm --name "${WALLETD_CONTAINER_NAME}" -p "8089:8089"`;
    if (persistVolume) {
        cmd += persistVolume;
    }
    cmd += ` ${walletd.image}`;

    return cmd;
}

async function stopContainers() {
    console.error(chalk.yellow('\nStopping all services...'));
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

