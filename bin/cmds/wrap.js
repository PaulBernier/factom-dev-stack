#!/usr/bin/env node

const { run } = require('../../src/run');
const { stopContainers } = require('../../src/docker-containers');
const execSync = require('child_process').execSync;
const chalk = require('chalk');

exports.command = 'wrap <command>';
exports.describe = 'Start Factom dev stack, execute the command, stop Factom dev stack.';

exports.builder = function (yargs) {
    return yargs.option('config', {
        alias: 'c',
        type: 'string',
        describe: 'Path to Factom dev stack config file',
        default: '.factom-ds.json'
    }).positional('command', {
        describe: 'Command to execute while Factom dev sack is running.'
    });
};

exports.handler = async function (argv) {

    try {
        await run(argv.config);
        console.log(execSync(argv.command).toString());
    } catch (e) {
        console.error(chalk.red(e.message));
    } finally {
        await stopContainers();
    }
};

