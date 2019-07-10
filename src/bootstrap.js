const factomjs = require('factom');
const { FactomCli, isValidPrivateAddress } = factomjs;
const fs = require('fs');
const execSync = require('child_process').execSync;
const chalk = require('chalk');

async function bootstrap(config) {
    console.error(chalk.yellow('\nBootstrapping...'));

    const env = {};
    const cli = new FactomCli({ 
        factomd: { port: config.factomd.apiPort },
        walletd: { port: config.walletd.apiPort } 
    });
    await waitFactomdApiReady(cli);
    await fdsBootStrap(cli);
    const bootstrapConfig = config.bootstrap;
    if (typeof bootstrapConfig === 'object') {
        Object.assign(env, await userBootstrap(bootstrapConfig, cli));
        if (bootstrapConfig.waitNewBlock) {
            await waitNewBlock(cli);
        }
    }

    return env;
}

async function fdsBootStrap(cli) {
    await cli.walletdApi('import-addresses', {
        addresses: [{ secret: 'Fs3E9gV6DXsYzf7Fqx1fVBQPQXV695eP3k5XbmHEZVRLkMdD9qCK' }]
    });
}

async function waitNewBlock(cli) {
    console.error('* Waiting for a new block before continuing...');
    const referenceHeight = await cli.getHeights().then(r => r.directoryBlockHeight);
    let currentHeight = referenceHeight;
    while (currentHeight <= referenceHeight) {
        await sleep(1000);
        currentHeight = await cli.getHeights().then(r => r.directoryBlockHeight);
    }
}

async function waitFactomdApiReady(cli) {
    console.error('* Waiting for APIs to be ready...');
    while (
        await cli
            .getBalance('FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q')
            .then(b => b === 0)
            .catch(() => true)
    ) {
        await sleep(1000);
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function userBootstrap(config, cli) {
    const env = {};
    // Bootstrap files
    if (config.wallet) {
        await bootstrapWallet(cli, config.wallet);
    }

    // Scripts
    if (config.script) {
        console.error('* Running bootstrap script:\n');
        execSync(config.script, { stdio: 'inherit' });
        console.error('\n');
    }
    if (config.scriptjs) {
        console.error('* Running bootstrap JavaScript script:\n');
        const f = require(config.scriptjs);
        const returned = await f(cli, factomjs);
        if (typeof returned === 'object') {
            Object.assign(env, returned);
        }
        console.error();
    }

    return env;
}

async function bootstrapWallet(cli, bootstrapData) {
    try {
        const data =
            typeof bootstrapData === 'string'
                ? JSON.parse(fs.readFileSync(bootstrapData))
                : bootstrapData;
        if (Array.isArray(data)) {
            const privateAddresses = data
                .filter(isValidPrivateAddress)
                .map(sec => ({ secret: sec }));
            await cli.walletdApi('import-addresses', { addresses: privateAddresses });
        }
    } catch (e) {
        console.error(chalk.red(`Failed to bootstrap wallet: ${e.message}`));
    }
}

module.exports = {
    bootstrap
};
