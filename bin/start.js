#!/usr/bin/env node
const main = require('../dist/index').default;
const Commander = require('commander');
const packageInfo = require('../package.json');

const program = new Commander.Command();
program.version(packageInfo.version);

main(program);

program.parseAsync(process.argv);
