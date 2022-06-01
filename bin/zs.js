#!/usr/bin/env node

const program = require('commander')

program
  .command('ci')
  .description('创建.gitlab-ci.yml构建脚本,请确保在git项目目录中')
  .action(() => {
    require('../lib/ci')()
  })

program.parse(process.argv)
