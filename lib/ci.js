const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Rx = require('rxjs')
const ejs = require('ejs')
const path = require('path')
const debug = require('debug')('ci')
const { hasProjectGit, gitTopLevelPath, hasFile } = require('./util/env')
const writeFileTree = require('./util/writeFileTree')

const questions = {
  'DEPLOY_WINDOWS_150_PATH': {
    name: 'DEPLOY_WINDOWS_150_PATH',
    type: 'input',
    message: `请输入150机器相对于D:/web的部署路径(选填):`,
  },
  'DEPLOY_ALIYUN_101_PATH': {
    name: 'DEPLOY_ALIYUN_101_PATH',
    type: 'input',
    message: `请输入阿里云101部署路径:`,
  },
  'ROBOT_URL': {
    name: 'ROBOT_URL',
    type: 'input',
    message: `请输入机器人webhook地址(选填):`,
    validate: input => input === '' ? 
                true : /^(http|https)/.test(input) ?
                true : '请输入正确的url地址'
  },
  'PROJECT_DIR': {
    name: 'PROJECT_DIR',
    type: 'input',
    message: `请输入项目地址(选填):`,
  },
  'BUILD_PATH': {
    name: 'BUILD_PATH',
    type: 'input',
    message: `请输入项目构建路径:`,
    default: 'dist'
  }
}
async function create() {
  if (!hasProjectGit(process.cwd())) {
    return Promise.reject('创建失败,当前不是git项目')
  }

  const dir = __dirname
  const cwd = gitTopLevelPath()
  debug('cwd: %s', cwd)

  if (hasFile(path.resolve(cwd, './.gitlab-ci.yml'))) {
    const { overwrite } = await inquirer.prompt([{
      name: 'overwrite',
      type: 'confirm',
      message: '.gitlab-ci.yml文件已存在,是否覆盖?'
    }])
    if (!overwrite) return
  }

  // let prompts = new Rx.Subject()
  // inquirer.prompt(prompts)
  // prompts.next(questions[150])
  // await prompts.complete()
  
  let q2 = questions.DEPLOY_ALIYUN_101_PATH
  const answer1  = await inquirer.prompt([questions.DEPLOY_WINDOWS_150_PATH])
  if (!answer1.DEPLOY_WINDOWS_150_PATH) {
    q2 = { ...questions.DEPLOY_ALIYUN_101_PATH , validate: input => input ? true : '150和101部署地址不能都为空' }
  }
  const answer2 = await inquirer.prompt(q2)
  const answer3 = await inquirer.prompt([questions.ROBOT_URL])
  const answer4 = answer3.ROBOT_URL ? await inquirer.prompt([questions.PROJECT_DIR]) : { PROJECT_DIR: ''}
  const answer5 = await inquirer.prompt([questions.BUILD_PATH])
  const ciData = Object.assign(answer1, answer2, answer3, answer4, answer5)

  debug('input: %O', ciData)
  const ciDir = path.resolve(dir, './template/.gitlab-ci.yml')
  const str = await ejs.renderFile(ciDir, ciData, { async: true })
  const file = {
    '.gitlab-ci.yml': str
  }
  await writeFileTree(cwd, file)
}

module.exports = (...args) => {
  return create().catch(err => {
    console.error(chalk.red(err))
    process.exit(1)
  })
}