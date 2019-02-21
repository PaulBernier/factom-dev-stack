#!/usr/bin/env node

const { stop } = require('../../src/run');
const chalk = require('chalk');

exports.command = 'stop';
exports.describe = 'Stop Factom dev stack.';

exports.handler = async function () {
    try {
        await stop();
    } catch (e) {
        console.error(chalk.red(e.message));
        process.exit(1);
    }
};