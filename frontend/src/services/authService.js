import api from '../api'

export async function login(credentials){
  return api.login(credentials)
}

export async function register(data){
  return api.register(data)
}

export default { login, register }
