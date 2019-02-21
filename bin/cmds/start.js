#!/usr/bin/env node

const { run, stop } = require('../../src/run');

const chalk = require('chalk');

exports.command = 'start';
exports.describe = 'Start Factom dev stack.';

exports.builder = function (yargs) {
    return yargs.option('config', {
        alias: 'c',
        type: 'string',
        describe: 'Path to a Factom dev stack config file',
        default: '.'
    }).option('persist', {
        alias: 'p',
        type: 'string',
        describe: 'Tag name of the persistence volume'
    });
};

exports.handler = async function (argv) {

    try {
        await run({ configPath: argv.config, flagConfig: flagConfig(argv) });
    } catch (e) {
        console.error(chalk.red(e.message));
        await stop();
        process.exit(1);
    }
};

function flagConfig(argv) {
    return {
        persist: argv.persist
    };
}
