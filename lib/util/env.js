const { execSync } = require('child_process')
const fs = require('fs')
let _hasGit = false
exports.hasGit = () => {
  if (_hasGit) return _hasGit
  try {
    execSync('git --version', { stdio: 'ignore' })
    return (_hasGit = true)
  } catch (e) {
    return (_hasGit = false)
  }
}
exports.hasProjectGit = (cwd) => {
  let result
  try {
    execSync('git status', { stdio: 'ignore', cwd })
    result = true
  } catch (e) {
    result = false
  }
  return result
}
exports.gitTopLevelPath = () => {
  let dir
  dir = execSync('git rev-parse --show-toplevel').toString().replace('\n', '')
  return dir
}
exports.hasFile = (cwd) => {
  let result = false
  try {
    fs.accessSync(cwd, fs.constants.F_OK)
    result = true
  } catch (e) {
    result = false
  }
  return result
}
