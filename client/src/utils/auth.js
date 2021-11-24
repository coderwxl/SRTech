import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const ServerAddressKey = 'server_address'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getServerAddress() {
  return Cookies.get(ServerAddressKey)
}

export function setServerAddress(token) {
  return Cookies.set(ServerAddressKey, token)
}

export function removeServerAddress() {
  return Cookies.remove(ServerAddressKey)
}