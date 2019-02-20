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
        default: '.'
    }).positional('command', {
        describe: 'Command to execute while Factom dev sack is running.'
    });
};

exports.handler = async function (argv) {

    let status = 0;
    try {
        const bootstrapEnv = await run(argv.config);
        console.error();
        console.error('Running user command...');

        const env = Object.assign({ ...process.env }, bootstrapEnv);
        execSync(argv.command, { stdio: 'inherit', env });
    } catch (e) {
        console.error(chalk.red(e.message));
        if (e.stdout) {
            console.log(e.stdout.toString());
        }
        status = e.status || 1;
    } finally {
        await stopContainers();
    }
    process.exit(status);
};

