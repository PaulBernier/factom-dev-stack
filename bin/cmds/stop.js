#!/usr/bin/env node

const { stopContainers } = require('../../src/docker-containers');
const chalk = require('chalk');

exports.command = 'stop';
exports.describe = 'Stop Factom dev stack.';

exports.handler = async function () {
    try {
        await stopContainers();
    } catch (e) {
        console.error(chalk.red(e.message));
    }
};