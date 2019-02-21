#!/usr/bin/env node

const { run, stop } = require('../../src/run');
const execSync = require('child_process').execSync;
const chalk = require('chalk');

exports.command = 'wrap <command>';
exports.describe = 'Start Factom dev stack, execute the command, stop Factom dev stack.';

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
    }).positional('command', {
        describe: 'Command to execute while Factom dev sack is running.'
    });
};

exports.handler = async function (argv) {

    let status = 0;
    try {
        const bootstrapEnv = await run({ configPath: argv.config, flagConfig: flagConfig(argv) });

        console.error(chalk.yellow('Running user command:\n'));

        const env = Object.assign({ ...process.env }, bootstrapEnv);
        execSync(argv.command, { stdio: 'inherit', env });
    } catch (e) {
        console.error(chalk.red(e.message));
        if (e.stdout) {
            console.log(e.stdout.toString());
        }
        status = e.status || 1;
    } finally {
        await stop();
    }
    process.exit(status);
};

function flagConfig(argv) {
    return {
        persist: argv.persist
    };
}
