const { FactomCli } = require('factom');
const execSync = require('child_process').execSync;

async function bootstrap(config) {
    console.error('Bootstrapping...');

    const cli = new FactomCli();
    await fdsBootStrap(cli);
    if (typeof config === 'object') {
        await userBootstrap(config, cli);
    }
}

async function fdsBootStrap(cli) {
    await waitFactomdApiReady(cli);
    await cli.walletdApi('import-addresses', { addresses: [{ secret: 'Fs3E9gV6DXsYzf7Fqx1fVBQPQXV695eP3k5XbmHEZVRLkMdD9qCK' }] });
}

async function waitFactomdApiReady(cli) {
    while (await cli.factomdApi('properties').then(() => false).catch(() => true)) {
        await sleep(500);
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function userBootstrap(config, cli) {
    if (config.script) {
        execSync(`${config.script}`);
    }
    if (config.scriptjs) {
        const f = require(`${config.scriptjs}`);
        await f(cli);
    }
    if (config.transactions) {
        bootstrapTransactions(config.transactions);
    }
    if (config.chains) {
        bootstrapChains(config.chains);
    }
    if (config.entries) {
        bootstrapEntries(config.entries);
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