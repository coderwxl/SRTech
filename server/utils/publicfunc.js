var tokenList = []

exports.addNewToken = function (uuid) {
  tokenList.push(uuid);
}

exports.removeToken = function (uuid) {
  tokenList = tokenList.filter(element => {
    return element !== uuid
  })
}

exports.checkToken = function (uuid) {
  for (let element of tokenList) {
    if (element === uuid) {
      return true
    }
  }
  return false
}