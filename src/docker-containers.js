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
        buildWalletdCommand(config.walletd, config.factomd, persistVolume)
    ];

    await Promise.all(
        [config.factomd.image, config.walletd.image].map(pullImage)
    );
    await Promise.all(commands.map(c => exec(c)));
    console.error(
        `* factomd instance started (${chalk.blue(config.factomd.image)})`
    );
    console.error(
        `* factom-walletd instance started (${chalk.blue(
            config.walletd.image
        )})`
    );
}

async function pullImage(image) {
    console.error(`* Pulling image ${chalk.blue(image)}`);
    await exec(`docker pull ${image}`);
}

async function getPersistVolume(config) {
    if (config.persist) {
        const volumeName = `fds-${config.persist}`;
        await exec(
            `docker volume create --name=${volumeName} --label factom-dev-stack=true`
        );
        return ` -v "${volumeName}:/root/.factom"`;
    }
}

function buildFactomdCommand(factomd, persistVolume) {
    const apiPort = factomd.apiPort;
    const cpPort = factomd.controlPanelPort;
    let cmd = `docker run -d --rm --name "${FACTOMD_CONTAINER_NAME}" -p "${apiPort}:${apiPort}" -p "${cpPort}:${cpPort}"`;

    if (factomd.conf) {
        cmd += ` -v ${path.dirname(factomd.conf)}:/factomd-config:ro`;
    }
    if (persistVolume) {
        cmd += persistVolume;
    }

    cmd += ` ${factomd.image} -port=${apiPort} -controlpanelport=${cpPort} -startdelay=0 -faulttimeout=0 -network=LOCAL`;
    if (factomd.conf) {
        cmd += ` -config /factomd-config/${path.basename(factomd.conf)}`;
    }
    if (factomd.blockTime) {
        cmd += ` -blktime=${factomd.blockTime}`;
    }
    return cmd;
}

function buildWalletdCommand(walletd, factomd, persistVolume) {
    const apiPort = walletd.apiPort;
    const factomdApiPort = factomd.apiPort;

    let cmd = `docker run -d --rm --name "${WALLETD_CONTAINER_NAME}" -p "${apiPort}:${apiPort}"`;
    if (persistVolume) {
        cmd += persistVolume;
    }
    cmd += ` ${walletd.image} -p=${apiPort} -s=localhost:${factomdApiPort}`;

    return cmd;
}

async function stopContainers() {
    console.error(chalk.yellow('\nStopping all services...'));
    try {
        await Promise.all([
            exec('docker stop fds-factomd'),
            exec('docker stop fds-walletd')
        ]);
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
