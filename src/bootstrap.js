const factomjs = require('factom');
const { FactomCli, isValidPrivateAddress } = factomjs;
const fs = require('fs');
const execSync = require('child_process').execSync;

async function bootstrap(config) {
    console.error();
    console.error('Bootstrapping...');

    const cli = new FactomCli();
    await waitFactomdApiReady(cli);
    await fdsBootStrap(cli);
    if (typeof config === 'object') {
        await userBootstrap(config, cli);
        if (config.waitNewBlock) {
            await waitNewBlock(cli);
        }
    }
}

async function fdsBootStrap(cli) {
    await cli.walletdApi('import-addresses', { addresses: [{ secret: 'Fs3E9gV6DXsYzf7Fqx1fVBQPQXV695eP3k5XbmHEZVRLkMdD9qCK' }] });
}

async function waitNewBlock(cli) {
    console.error('Waiting for a new block before continuing...');
    const referenceHeight = await cli.getHeights().then(r => r.directoryBlockHeight);
    let currentHeight = referenceHeight;
    while (currentHeight <= referenceHeight) {
        await sleep(1000);
        currentHeight = await cli.getHeights().then(r => r.directoryBlockHeight);
    }
}

async function waitFactomdApiReady(cli) {
    console.error('Waiting for API to be ready...');
    while (await cli.factomdApi('properties').then(() => false).catch(() => true)) {
        await sleep(1000);
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function userBootstrap(config, cli) {
    // Bootstrap files
    if (config.wallet) {
        await bootstrapWallet(cli, config.wallet);
    }
    if (config.transactions) {
        await bootstrapTransactions(config.transactions);
    }
    if (config.chains) {
        await bootstrapChains(config.chains);
    }
    if (config.entries) {
        await bootstrapEntries(config.entries);
    }

    // Scripts
    if (config.script) {
        console.error('Running bootstrap script...');
        execSync(config.script, { stdio: 'inherit' });
    }
    if (config.scriptjs) {
        console.error('Running bootstrap JavaScript script...');
        const f = require(config.scriptjs);
        await f(cli, factomjs);
    }
}

async function bootstrapWallet(cli, filePath) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath));
        if (Array.isArray(data)) {
            const privateAddresses = data.filter(isValidPrivateAddress).map(sec => ({ secret: sec }));
            await cli.walletdApi('import-addresses', { addresses: privateAddresses });
        }
    } catch (e) {
        console.error(`Failed to bootstrap wallet: ${e.message}`);
    }
}

async function bootstrapChains() {
    // TODO
}

async function bootstrapEntries() {
    // TODO
}

async function bootstrapTransactions() {
    // TODO
}

module.exports = {
    bootstrap
};