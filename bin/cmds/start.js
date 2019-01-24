#!/usr/bin/env node

const { run } = require('../../src/run');
const { stopContainers } = require('../../src/docker-containers');

const chalk = require('chalk');

exports.command = 'start';
exports.describe = 'Start Factom dev stack.';

exports.builder = function (yargs) {
    return yargs.option('config', {
        alias: 'c',
        type: 'string',
        describe: 'Path to Factom dev stack config file',
        default: '.factom-ds.json'
    });
};

exports.handler = async function (argv) {

    try {
        await run(argv.config);
    } catch (e) {
        console.error(chalk.red(e.message));
        await stopContainers();
        process.exit(1);
    }
};

