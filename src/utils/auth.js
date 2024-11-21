import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserKey = 'Admin-User'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(UserKey)
}

export function setUser(info) {
  return Cookies.set(UserKey, {
    'id': info['id'],
    'name': info['name'],
    'role': info['role']
  })
}
